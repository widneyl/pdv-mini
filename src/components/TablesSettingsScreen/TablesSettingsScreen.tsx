import { Ionicons } from "@expo/vector-icons";
import { Button, Text, XStack, YStack } from "tamagui";
import type { RestaurantTable } from "@/types/types";

interface TablesSettingsScreenProps {
  tables: RestaurantTable[];
  onBack: () => void;
  onAdd: () => void;
  onDelete: () => void;
}

export function TablesSettingsScreen({ tables, onBack, onAdd, onDelete }: TablesSettingsScreenProps) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <XStack alignItems="center" padding="$3" gap="$3">
        <Button size="$3" circular chromeless onPress={onBack}>
          <Ionicons name="arrow-back" size={24} />
        </Button>
        <YStack flex={1}>
          <Text fontSize="$7" fontWeight="800">Mesas</Text>
          <Text fontSize="$3" color="$color10">Quantidade de mesas</Text>
        </YStack>
      </XStack>

      <YStack flex={1} alignItems="center" justifyContent="center" padding="$3" gap="$5">
        <Text fontSize="$3" color="$color10">Quantidade de mesas</Text>

        <XStack alignItems="center" gap="$5">
          <Button size="$5" circular onPress={onDelete} disabled={tables.length <= 1}>
            <Ionicons name="remove" size={26} />
          </Button>

          <Text fontSize="$10" fontWeight="800">{tables.length}</Text>

          <Button size="$5" circular onPress={onAdd}>
            <Ionicons name="add" size={26} />
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}