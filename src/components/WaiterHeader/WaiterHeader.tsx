import { Ionicons } from "@expo/vector-icons";
import { Button, Text, XStack } from "tamagui";

interface WaiterHeaderProps {
  onSettings: () => void;
}

export function WaiterHeader({ onSettings }: WaiterHeaderProps) {
  return (
    <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$1" paddingVertical="$2">
      <Text fontSize="$7" fontWeight="800">PDV Garçom</Text>
      <Button size="$3" circular chromeless onPress={onSettings}>
        <Ionicons name="settings-outline" size={24} />
      </Button>
    </XStack>
  );
}