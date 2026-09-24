import { useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack, YStack, Text, Card } from "tamagui";
import type { RestaurantTable } from "@/types/types";
import { SettingsScreen } from "./SettingsScreen";
import { TableScreen } from "@/components/TableScreen/TableSceen";
import { TablesSettingsScreen } from "@/components/TablesSettingsScreen/TablesSettingsScreen";
import { WaiterHeader } from "@/components/WaiterHeader/WaiterHeader";

type Screen = "home" | "settings" | "tables";

interface WaiterPOSScreenProps {
  tables: RestaurantTable[];
  onLogout: () => void;
}

export function WaiterPOSScreen({ tables: initialTables, onLogout }: WaiterPOSScreenProps) {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables);
  const { width } = useWindowDimensions();

  const sorted = useMemo(() => [...tables].sort((a, b) => a.number - b.number), [tables]);
  const gap = 8;
  const padding = 12;
  const cardWidth = (width - padding * 2 - gap * 2) / 3;

  const getTableColor = (table: RestaurantTable) => {
    if (table.status === "OCCUPIED") return "$green9";
    if (table.status === "CLOSED") return "$red9";
    return "$gray1";
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (selectedTable) {
        setSelectedTable(null);
        return true;
      }

      if (screen === "tables") {
        setScreen("settings");
        return true;
      }

      if (screen === "settings") {
        setScreen("home");
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [screen, selectedTable]);

  const addTable = () => {
    const nextNumber = tables.length ? Math.max(...tables.map((table) => table.number)) + 1 : 1;

    const newTable: RestaurantTable = {
      id: String(Date.now()),
      createdAt: new Date(),
      restaurantRef: "1",
      number: nextNumber,
    };

    setTables((current) => [...current, newTable]);
  };

  const deleteTable = (table: RestaurantTable) => {
    setTables((current) => current.filter((item) => item.id !== table.id));
  };

  const removeTable = () => {
    if (tables.length <= 1) return;
    setTables((current) => current.slice(0, -1));
  };

  if (selectedTable) {
    return <TableScreen table={selectedTable} onBack={() => setSelectedTable(null)} />;
  }

  if (screen === "tables") {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TablesSettingsScreen tables={sorted} onBack={() => setScreen("settings")} onAdd={addTable} onDelete={removeTable} />
      </SafeAreaView>
    );
  }

  if (screen === "settings") {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SettingsScreen onBack={() => setScreen("home")} onTables={() => setScreen("tables")} onLogout={onLogout} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$3" gap="$3">
        <WaiterHeader onSettings={() => setScreen("settings")} />

        <YStack>
          <Text fontSize="$3" color="$color10">{sorted.length} mesas</Text>
        </YStack>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          <XStack flexWrap="wrap" gap="$2">
            {sorted.map((table) => (
              <Card key={table.id} width={cardWidth} padding="$3" borderRadius="$5" backgroundColor={getTableColor(table)} borderWidth={1} borderColor="$borderColor" onPress={() => setSelectedTable(table)}>
                <YStack alignItems="center" gap="$1">
                  <Text fontSize="$6" fontWeight="800" color={table.status === "FREE" ? "$color" : "white"}>{table.number}</Text>
                  <Text fontSize="$3" color={table.status === "FREE" ? "$color10" : "white"}>Mesa {table.number}</Text>
                </YStack>
              </Card>
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}