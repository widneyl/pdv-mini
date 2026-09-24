import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Text, XStack, YStack } from "tamagui";

interface SettingsScreenProps {
  onBack: () => void;
  onTables: () => void;
  onLogout: () => void;
}

export function SettingsScreen({ onBack, onTables, onLogout }: SettingsScreenProps) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <XStack alignItems="center" padding="$3" gap="$3">
        <Button size="$3" circular chromeless onPress={onBack}>
          <Ionicons name="arrow-back" size={24} />
        </Button>
        <Text fontSize="$7" fontWeight="800">Configurações</Text>
      </XStack>

      <YStack padding="$3" gap="$2">
        <Card
          padding="$3"
          borderRadius="$4"
          backgroundColor="$gray1"
          borderWidth={1}
          borderColor="$borderColor"
          onPress={onTables}
        >
          <XStack alignItems="center" gap="$3">
            <Ionicons name="grid-outline" size={24} />
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="700">Mesas</Text>
              <Text fontSize="$3" color="$color10">Gerenciar mesas</Text>
            </YStack>
            <Ionicons name="chevron-forward" size={20} />
          </XStack>
        </Card>

        <Card
          padding="$3"
          borderRadius="$4"
          backgroundColor="$gray1"
          borderWidth={1}
          borderColor="$borderColor"
          onPress={onLogout}
        >
          <XStack alignItems="center" gap="$3">
            <Ionicons name="log-out-outline" size={24} color="red" />
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="700" color="$red10">Sair</Text>
              <Text fontSize="$3" color="$color10">Sair da conta</Text>
            </YStack>
          </XStack>
        </Card>
      </YStack>
    </YStack>
  );
}