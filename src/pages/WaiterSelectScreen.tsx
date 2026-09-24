import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Text, XStack, YStack } from "tamagui";

interface Waiter {
  id: string;
  name: string;
}

interface WaiterSelectScreenProps {
  waiters: Waiter[];
  onConfirm: (waiter: Waiter) => void;
  onBack: () => void;
}

export function WaiterSelectScreen({ waiters, onConfirm, onBack }: WaiterSelectScreenProps) {
  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);
  const [password, setPassword] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    if (!selectedWaiter) return;
    if (!password.trim()) return;
    onConfirm(selectedWaiter);
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

        <Button
          size="$4"
          height={52}
          backgroundColor="$blue10"
          color="white"
          borderRadius="$4"
          onPress={handleConfirm}
        >
          <Text color="white" fontSize="$4" fontWeight="700">Entrar no PDV</Text>
        </Button>

        <Button chromeless onPress={onBack}>
          <Text color="$color10">Voltar</Text>
        </Button>
      </YStack>
    </YStack>
  );
}