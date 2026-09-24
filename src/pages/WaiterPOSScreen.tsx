import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Spinner, Text, XStack, YStack } from "tamagui";
import type { RestaurantTable } from "@/model/restaurantTable";
import { restaurantTableService } from "@/services/restaurantTableService";
import { SettingsScreen } from "./SettingsScreen";
import { TableScreen } from "@/components/TableScreen/TableSceen";
import { TablesSettingsScreen } from "@/components/TablesSettingsScreen/TablesSettingsScreen";
import { WaiterHeader } from "@/components/WaiterHeader/WaiterHeader";

type Screen = "home" | "settings" | "tables";

interface WaiterPOSScreenProps {
  onLogout: () => void;
}

export function WaiterPOSScreen({ onLogout }: WaiterPOSScreenProps) {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [tablesError, setTablesError] = useState<string | null>(null);
  const [savingTables, setSavingTables] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const loadTables = useCallback(async () => {
    setLoadingTables(true);
    setTablesError(null);
    try {
      const data = await restaurantTableService.list();
      setTables(data);
    } catch {
      setTablesError("Não foi possível carregar as mesas.");
    } finally {
      setLoadingTables(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await restaurantTableService.list();
        if (!active) return;
        setTables(data);
      } catch {
        if (active) setTablesError("Não foi possível carregar as mesas.");
      } finally {
        if (active) setLoadingTables(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleConfirmTables = async (count: number) => {
    if (savingTables) return;
    setSavingTables(true);
    setSaveError(null);
    try {
      await restaurantTableService.createMany(count);
      await loadTables();
      setScreen("settings");
    } catch {
      setSaveError("Não foi possível salvar a quantidade de mesas.");
    } finally {
      setSavingTables(false);
    }
  };

  const sorted = useMemo(() => [...tables].sort((a, b) => a.number - b.number), [tables]);
  const gap = 8;
  const padding = 12;
  const minCardWidth = 100;
  const columns = Math.max(1, Math.floor((width - padding * 2 + gap) / (minCardWidth + gap)));
  const cardWidth = (width - padding * 2 - gap * (columns - 1)) / columns;

  const getTableColor = (table: RestaurantTable) => {
    if (table.status === "OCCUPIED") return "$green9";
    if (table.status === "CLOSED") return "$red9";
    return "$gray1";
  };

  const isTableFree = (table: RestaurantTable) => table.status === "FREE" || table.status == null;

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

  if (selectedTable) {
    return <TableScreen table={selectedTable} onBack={() => setSelectedTable(null)} />;
  }

  if (screen === "tables") {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TablesSettingsScreen
          tables={sorted}
          onBack={() => setScreen("settings")}
          onConfirm={handleConfirmTables}
          loading={savingTables}
          error={saveError}
        />
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

        {loadingTables ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <Spinner size="large" />
          </YStack>
        ) : tablesError ? (
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$3">
            <Text color="$red10" fontSize="$3">{tablesError}</Text>
            <Button onPress={loadTables}>
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
                  <Card key={table.id} width={cardWidth} padding="$3" borderRadius="$5" backgroundColor={getTableColor(table)} borderWidth={1} borderColor="$borderColor" onPress={() => setSelectedTable(table)}>
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