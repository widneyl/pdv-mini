import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Button, Text, XStack, YStack } from "tamagui";
import { useTables } from "@/contexts/TablesContext";
import { restaurantTableService } from "@/services/restaurantTableService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PosStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<PosStackParamList, "TablesSettings">;

export function TablesSettingsScreen({ navigation }: Props) {
  const { tables, refresh } = useTables();
  const [count, setCount] = useState(tables.length);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await restaurantTableService.createMany(count);
      await refresh();
      navigation.goBack();
    } catch {
      setSaveError("Não foi possível salvar a quantidade de mesas.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <XStack alignItems="center" padding="$3" gap="$3">
        <Button size="$3" circular chromeless onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </Button>
        <YStack flex={1}>
          <Text fontSize="$7" fontWeight="800">Mesas</Text>
          <Text fontSize="$3" color="$color10">Quantidade de mesas</Text>
        </YStack>
      </XStack>

      <YStack flex={1} alignItems="center" justifyContent="center" padding="$3" gap="$6">
        <Text fontSize="$3" color="$color10">Quantidade de mesas</Text>

        <XStack alignItems="center" gap="$5">
          <Button
            size="$5"
            circular
            onPress={() => setCount((value) => Math.max(1, value - 1))}
            disabled={count <= 1}
          >
            <Ionicons name="remove" size={26} />
          </Button>

          <Text fontSize="$10" fontWeight="800">{count}</Text>

          <Button size="$5" circular onPress={() => setCount((value) => value + 1)}>
            <Ionicons name="add" size={26} />
          </Button>
        </XStack>

        {saveError ? <Text color="$red10" fontSize="$3">{saveError}</Text> : null}

        <Button
          size="$4"
          height={52}
          width={200}
          backgroundColor="$blue10"
          color="white"
          borderRadius="$4"
          onPress={handleConfirm}
          disabled={saving}
          opacity={saving ? 0.6 : 1}
        >
          <Text color="white" fontSize="$4" fontWeight="700">
            {saving ? "Salvando..." : "Confirmar"}
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}
