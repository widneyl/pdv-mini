import { useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, Text, Card } from "tamagui";
import type { RestaurantTable } from "@/types/types";
import { TableScreen } from "./TableScreen/TableSceen";
import { WaiterHeader } from "./WaiterHeader/WaiterHeader";

export function WaiterPOSScreen({ tables }: { tables: RestaurantTable[] }) {
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const { width } = useWindowDimensions();
  const sorted = useMemo(() => [...tables].sort((a, b) => a.number - b.number), [tables]);
  const gap = 8;
  const padding = 12;
  const cardWidth = (width - padding * 2 - gap * 2) / 3;

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (selectedTable) {
        setSelectedTable(null);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [selectedTable]);

  if (selectedTable) {
    return <TableScreen table={selectedTable} onBack={() => setSelectedTable(null)} />;
  }

  const handleSettings = () => {
    console.log("Abrir configurações");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$3" gap="$3">
        <WaiterHeader onSettings={handleSettings} />
        <YStack>
          <Text fontSize="$3" color="$color10">{sorted.length} mesas</Text>
        </YStack>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          <XStack flexWrap="wrap" gap="$2">
            {sorted.map((table) => (
              <Card key={table.id} width={cardWidth} padding="$3" borderRadius="$5" backgroundColor="$gray1" borderWidth={1} borderColor="$borderColor" onPress={() => setSelectedTable(table)}>
                <YStack alignItems="center" gap="$1">
                  <Text fontSize="$6" fontWeight="800">{table.number}</Text>
                  <Text fontSize="$3" color="$color10">Mesa {table.number}</Text>
                </YStack>
              </Card>
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}