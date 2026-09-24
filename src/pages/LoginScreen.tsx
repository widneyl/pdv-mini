import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Text, XStack, YStack } from "tamagui";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    onLogin();
  };

  return (
    <YStack flex={1} backgroundColor="$background" justifyContent="center" padding="$5">
      <YStack width="100%" maxWidth={420} alignSelf="center" gap="$5">
        <YStack gap="$2">
          <Text fontSize="$9" fontWeight="800">PDV Mini</Text>
          <Text fontSize="$4" color="$color10">Entre na sua conta para continuar</Text>
        </YStack>

        <YStack gap="$3">
          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">E-mail</Text>
            <Input
              size="$4"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">Senha</Text>
            <XStack alignItems="center">
              <Input
                flex={1}
                size="$4"
                placeholder="Sua senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                paddingRight="$10"
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

        <Button size="$4" height={52} backgroundColor="$blue10" color="white" borderRadius="$4" onPress={handleLogin}>
          <Text color="white" fontSize="$4" fontWeight="700">Entrar</Text>
        </Button>
      </YStack>
    </YStack>
  );
}