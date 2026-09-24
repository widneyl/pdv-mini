import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Spinner, Text, XStack, YStack } from "tamagui";
import { UserRole } from "@/model/user";
import { SafeUser, userService } from "@/services/userService";

interface WaiterSelectScreenProps {
  onConfirm: (waiter: SafeUser) => void;
  onBack: () => void;
}

export function WaiterSelectScreen({ onConfirm, onBack }: WaiterSelectScreenProps) {
  const [waiters, setWaiters] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedWaiter, setSelectedWaiter] = useState<SafeUser | null>(null);
  const [password, setPassword] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const users = await userService.list();
        if (!active) return;
        setWaiters(users);
      } catch (errors: any) {
        console.info(errors.message)
        if (active) setLoadError("Não foi possível carregar os garçons.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleConfirm = async () => {
    if (!selectedWaiter || !password.trim() || authenticating) return;
    setAuthenticating(true);
    setAuthError(null);
    try {
      const user = await userService.authenticate(selectedWaiter.name, password);
      onConfirm(user);
    } catch (error: any) {
      setAuthError("Senha inválida.");
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background" justifyContent="center" padding="$5">
      <YStack width="100%" maxWidth={420} alignSelf="center" gap="$5">
        <YStack gap="$2">
          <Text fontSize="$9" fontWeight="800">Selecionar garçom</Text>
          <Text fontSize="$4" color="$color10">Selecione seu usuário para acessar o PDV</Text>
        </YStack>

        <YStack gap="$3">
          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">Garçom</Text>

            {loading ? (
              <YStack height={52} alignItems="center" justifyContent="center">
                <Spinner size="small" />
              </YStack>
            ) : loadError ? (
              <Text color="$red10" fontSize="$3">{loadError}</Text>
            ) : (
              <>
                <Button
                  size="$4"
                  height={52}
                  justifyContent="space-between"
                  borderWidth={1}
                  borderColor="$borderColor"
                  backgroundColor="$background"
                  onPress={() => setSelectOpen((value) => !value)}
                >
                  <Text color={selectedWaiter ? "$color" : "$color10"}>
                    {selectedWaiter?.name ?? "Selecione o garçom"}
                  </Text>
                  <Ionicons name={selectOpen ? "chevron-up" : "chevron-down"} size={20} />
                </Button>

                {selectOpen && (
                  <YStack borderWidth={1} borderColor="$borderColor" borderRadius="$4" overflow="hidden">
                    {waiters.map((waiter) => (
                      <Button
                        key={waiter.id}
                        height={48}
                        justifyContent="flex-start"
                        backgroundColor={selectedWaiter?.id === waiter.id ? "$gray3" : "$background"}
                        borderRadius={0}
                        onPress={() => {
                          setSelectedWaiter(waiter);
                          setSelectOpen(false);
                        }}
                      >
                        <Text fontSize="$4">{waiter.name}</Text>
                      </Button>
                    ))}
                  </YStack>
                )}
              </>
            )}
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">Senha</Text>

            <XStack alignItems="center">
              <Input
                flex={1}
                size="$4"
                height={52}
                placeholder="Senha do garçom"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />

              <Button
                position="absolute"
                right="$2"
                size="$3"
                circular
                chromeless
                onPress={() => setShowPassword((value) => !value)}
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={21} />
              </Button>
            </XStack>
          </YStack>
        </YStack>

        {authError ? <Text color="$red10" fontSize="$3">{authError}</Text> : null}

        <Button
          size="$4"
          height={52}
          backgroundColor="$blue10"
          color="white"
          borderRadius="$4"
          onPress={handleConfirm}
          disabled={loading || authenticating}
          opacity={loading || authenticating ? 0.6 : 1}
        >
          <Text color="white" fontSize="$4" fontWeight="700">
            {authenticating ? "Entrando..." : "Entrar no PDV"}
          </Text>
        </Button>

        <Button chromeless onPress={onBack}>
          <Text color="$color10">Voltar</Text>
        </Button>
      </YStack>
    </YStack>
  );
}