import { RestaurantTableResponse } from "@/model/restaurantTable";
import type { TableStackParamList } from "@/navigation/types";
import { restaurantTableService } from "@/services/restaurantTableService";
import { useTable } from "@/contexts/TableContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, BackHandler, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Separator, Text, XStack, YStack } from "tamagui";

type Props = NativeStackScreenProps<TableStackParamList, "TableDetail">;
type Tab = "items" | "bill";

export function TableScreen({ navigation, route }: Props) {
  const { id, number } = route.params;
  const [tab, setTab] = useState<Tab>("items");
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const menuX = useMemo(() => new Animated.Value(-320), []);

  const goToMenu = () => {
    navigation.navigate("Menu", { id, number });
  };

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    Animated.timing(menuX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [menuX]);

  const closeMenu = useCallback(() => {
    Animated.timing(menuX, {
      toValue: -320,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  }, [menuX]);

  const toggleItemSelection = (id: string) => {
    setSelectedItems((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  };

  const handleDeleteSelectedItems = () => {
    if (!selectedItems.length) return;

    setSelectedItems([]);
    setDeleteMode(false);
  };

  const openDeleteMode = () => {
    closeMenu();
    setDeleteMode(true);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (deleteMode) {
          setDeleteMode(false);
          setSelectedItems([]);
          return true;
        }

        if (menuOpen) {
          closeMenu();
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [deleteMode, menuOpen, closeMenu]);

  const [tableData, setTableData] = useState<
    undefined | RestaurantTableResponse
  >(undefined);
  const { clearCart } = useTable();

  const getTableData = useCallback(async () => {
    const result = await restaurantTableService.getById(id);
    setTableData(result);
  }, [id]);

  const items = tableData?.order?.orderItemSnapshot ?? [];
  const tableTotal = items.reduce((total, value) => {
    return total + value.price * value.quantity;
  }, 0)

  useFocusEffect(
    useCallback(() => {
      getTableData();
      clearCart();
    }, [getTableData, clearCart]),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background">
        <XStack alignItems="center" padding="$3" gap="$3">
          <Button size="$3" circular chromeless onPress={openMenu}>
            <Ionicons name="menu-outline" size={26} />
          </Button>

          <YStack flex={1}>
            <Text fontSize="$7" fontWeight="800">
              Mesa {number}
            </Text>
            <Text fontSize="$3" color="$color10">
              {tableData?.order?.orderItemSnapshot.length ?? 0} itens
            </Text>
          </YStack>

          <Text fontSize="$5" fontWeight="800">
            {formatCurrency(tableTotal)}
          </Text>
        </XStack>

        <Separator />

        {deleteMode ? (
          <YStack flex={1}>
            <XStack
              alignItems="center"
              justifyContent="space-between"
              padding="$3"
            >
              <Text fontSize="$5" fontWeight="800">
                Excluir produtos
              </Text>
              <Text fontSize="$3" color="$color10">
                {selectedItems.length} selecionados
              </Text>
            </XStack>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 12 }}
            >
              <YStack gap="$2">
                {items.map((item) => {
                  const selected = selectedItems.includes(item.id);
                  const unitTotal = item.price;
                  const total = unitTotal * item.quantity;

                  return (
                    <Card
                      key={item.id}
                      padding="$3"
                      borderRadius="$4"
                      backgroundColor={selected ? "$red3" : "$gray1"}
                      borderWidth={1}
                      borderColor={selected ? "$red8" : "$borderColor"}
                      onPress={() => toggleItemSelection(item.id)}
                    >
                      <XStack alignItems="center" gap="$3">
                        <Ionicons
                          name={
                            selected ? "checkmark-circle" : "ellipse-outline"
                          }
                          size={25}
                          color={selected ? "red" : undefined}
                        />

                        <YStack flex={1}>
                          <Text fontSize="$4" fontWeight="700">
                            {item.title}
                          </Text>
                          <Text fontSize="$3" color="$color10">
                            {formatCurrency(unitTotal)} × {item.quantity}
                          </Text>
                        </YStack>

                        <Text fontSize="$4" fontWeight="800">
                          {formatCurrency(total)}
                        </Text>
                      </XStack>
                    </Card>
                  );
                })}
              </YStack>
            </ScrollView>

            <YStack paddingHorizontal="$3" paddingVertical="$2">
              <Button
                height={48}
                borderRadius="$4"
                backgroundColor="$red9"
                color="white"
                disabled={!selectedItems.length}
                onPress={handleDeleteSelectedItems}
              >
                <Ionicons color="white" name="trash-outline" size={20} />
                <Text color="white">Excluir selecionados</Text>
              </Button>
            </YStack>
          </YStack>
        ) : (
          <>
            <YStack flex={1}>
              {tab === "items" ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 12, paddingBottom: 12 }}
                >
                  <YStack gap="$2">
                    {items.map((item) => {
                      const unitTotal = item.price;
                      const total = unitTotal * item.quantity;

                      return (
                        <Card
                          key={item.id}
                          padding="$3"
                          borderRadius="$4"
                          backgroundColor="$gray1"
                          borderWidth={1}
                          borderColor="$borderColor"
                        >
                          <XStack
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <YStack flex={1} gap="$1">
                              <Text fontSize="$4" fontWeight="700">
                                {item.title}
                              </Text>

                              <Text fontSize="$3" color="$color10">
                                {formatCurrency(unitTotal)} × {item.quantity}
                              </Text>
                            </YStack>

                            <Text fontSize="$4" fontWeight="800">
                              {formatCurrency(total)}
                            </Text>
                          </XStack>
                        </Card>
                      );
                    })}
                  </YStack>
                </ScrollView>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 12, paddingBottom: 12 }}
                >
                  <YStack gap="$3">
                    <Card
                      padding="$4"
                      borderRadius="$4"
                      backgroundColor="$gray1"
                    >
                      <YStack gap="$3">
                        <XStack justifyContent="space-between">
                          <Text fontSize="$5" fontWeight="800">
                            Total
                          </Text>
                          <Text fontSize="$5" fontWeight="800">
                            {formatCurrency(tableTotal * 1.1)}
                          </Text>
                        </XStack>
                      </YStack>
                    </Card>
                  </YStack>
                </ScrollView>
              )}
            </YStack>

            {tab === "items" ? (
              <YStack paddingHorizontal="$3" paddingVertical="$2">
                <Button
                  height={48}
                  borderRadius="$4"
                  backgroundColor="$blue10"
                  onPress={goToMenu}
                >
                  <Ionicons color="white" name="add" size={20} />
                  <Text color="white">Lançar produto</Text>
                </Button>
              </YStack>
            ) : (
              <YStack paddingHorizontal="$3" paddingVertical="$2">
                <Button
                  height={48}
                  borderRadius="$4"
                  backgroundColor="$red9"
                  color="white"
                  onPress={() => {}}
                >
                  <Text color="white">Fechar conta</Text>
                </Button>
              </YStack>
            )}

            <XStack
              backgroundColor="$background"
              borderTopWidth={1}
              borderColor="$borderColor"
              padding="$2"
              paddingBottom="$3"
            >
              <Button flex={1} chromeless onPress={() => setTab("items")}>
                <YStack alignItems="center" gap="$1">
                  <Ionicons name="receipt-outline" size={22} />
                  <Text
                    fontSize="$2"
                    fontWeight={tab === "items" ? "800" : "400"}
                  >
                    Itens
                  </Text>
                </YStack>
              </Button>

              <Button flex={1} chromeless onPress={() => setTab("bill")}>
                <YStack alignItems="center" gap="$1">
                  <Ionicons name="wallet-outline" size={22} />
                  <Text
                    fontSize="$2"
                    fontWeight={tab === "bill" ? "800" : "400"}
                  >
                    Conta
                  </Text>
                </YStack>
              </Button>
            </XStack>
          </>
        )}

        {menuOpen && (
          <Pressable
            onPress={closeMenu}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
        )}

        {menuOpen && (
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 220,
              transform: [{ translateX: menuX }],
            }}
          >
            <YStack
              flex={1}
              backgroundColor="$background"
              padding="$4"
              gap="$2"
            >
              <XStack
                alignItems="center"
                justifyContent="space-between"
                paddingBottom="$3"
              >
                <Text fontSize="$6" fontWeight="800">
                  Menu
                </Text>

                <Button size="$3" circular chromeless onPress={closeMenu}>
                  <Ionicons name="close" size={24} />
                </Button>
              </XStack>

              <Separator />

              <Button
                justifyContent="flex-start"
                height={52}
                chromeless
                onPress={openDeleteMode}
              >
                <Ionicons name="trash-outline" size={22} />
                <Text fontSize="$4">Excluir produtos</Text>
              </Button>
            </YStack>
          </Animated.View>
        )}
      </YStack>
    </SafeAreaView>
  );
}
