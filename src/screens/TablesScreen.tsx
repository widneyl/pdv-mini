import { useMemo } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Spinner, Text, XStack, YStack } from "tamagui";
import { useTables } from "@/contexts/TablesContext";
import type { RestaurantTableResponse } from "@/model/restaurantTable";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { PosStackParamList } from "@/navigation/types";
import { WaiterHeader } from "@/components/WaiterHeader/WaiterHeader";

type Props = NativeStackScreenProps<PosStackParamList, "Tables">;

export function TablesScreen({ navigation }: Props) {
  const { tables, loading, error, refresh } = useTables();
  const { width } = useWindowDimensions();

  const sorted = useMemo(() => [...tables].sort((a, b) => a.number - b.number), [tables]);
  const gap = 8;
  const padding = 12;
  const minCardWidth = 100;
  const columns = Math.max(1, Math.floor((width - padding * 2 + gap) / (minCardWidth + gap)));
  const cardWidth = (width - padding * 2 - gap * (columns - 1)) / columns;

  const getTableColor = (table: RestaurantTableResponse) => {
    if (table.order) return "$green9";
    return "$gray1";
  };

  const isTableFree = (table: RestaurantTableResponse) => table.order == null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$3" gap="$3">
        <WaiterHeader onSettings={() => navigation.navigate("Settings")} />

        {loading ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <Spinner size="large" />
          </YStack>
        ) : error ? (
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$3">
            <Text color="$red10" fontSize="$3">{error}</Text>
            <Button onPress={refresh}>
              <Text fontSize="$4">Tentar novamente</Text>
            </Button>
          </YStack>
        ) : (
          <>
            <YStack>
              <Text fontSize="$3" color="$color10">{sorted.length} mesas</Text>
            </YStack>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              <XStack flexWrap="wrap" gap="$2">
                {sorted.map((table) => (
                  <Card
                    key={table.id}
                    width={cardWidth}
                    padding="$3"
                    borderRadius="$5"
                    backgroundColor={getTableColor(table)}
                    borderWidth={1}
                    borderColor="$borderColor"
                    onPress={() => navigation.navigate("Table", { id: table.id, number: table.number })}
                  >
                    <YStack alignItems="center" gap="$1">
                      <Text fontSize="$6" fontWeight="800" color={isTableFree(table) ? "$color" : "white"}>{table.number}</Text>
                      <Text fontSize="$3" color={isTableFree(table) ? "$color10" : "white"}>Mesa {table.number}</Text>
                    </YStack>
                  </Card>
                ))}
              </XStack>
            </ScrollView>
          </>
        )}
      </YStack>
    </SafeAreaView>
  );
}
