import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, BackHandler, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Separator, Text, XStack, YStack } from "tamagui";
import type { RestaurantTable } from "@/model/restaurantTable";
import { TableMenuScreen } from "./TableMenuScreen";
import { OrderConfirmationScreen } from "./OrderConfirmationScreen";

export interface TableItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  additionals?: { name: string; price: number }[];
}

export interface MenuProduct {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface CartItem extends MenuProduct {
  quantity: number;
}

interface TableScreenProps {
  table: RestaurantTable;
  onBack: () => void;
}

type Screen = "table" | "menu" | "confirmation";
type Tab = "items" | "bill";

const mockItems: TableItem[] = [
  { id: "1", name: "Picanha", quantity: 2, price: 45, additionals: [{ name: "Farofa", price: 5 }] },
  { id: "2", name: "Cerveja Heineken", quantity: 3, price: 10 },
  { id: "3", name: "Refrigerante", quantity: 2, price: 7 },
];

const mockProducts: MenuProduct[] = [
  { id: "1", name: "Picanha", category: "Carnes", price: 45 },
  { id: "2", name: "Filé com fritas", category: "Carnes", price: 38 },
  { id: "3", name: "Cerveja Heineken", category: "Bebidas", price: 10 },
  { id: "4", name: "Cerveja Budweiser", category: "Bebidas", price: 9 },
  { id: "5", name: "Refrigerante", category: "Bebidas", price: 7 },
  { id: "6", name: "Batata frita", category: "Porções", price: 18 },
  { id: "7", name: "Calabresa acebolada", category: "Porções", price: 25 },
];

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`;

export function TableScreen({ table, onBack }: TableScreenProps) {
  const [screen, setScreen] = useState<Screen>("table");
  const [tab, setTab] = useState<Tab>("items");
  const [items, setItems] = useState<TableItem[]>(mockItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const menuX = useRef(new Animated.Value(-320)).current;

  const tableTotal = useMemo(() => items.reduce((total, item) => {
    const additionalsTotal = item.additionals?.reduce((sum, additional) => sum + additional.price, 0) ?? 0;
    return total + (item.price + additionalsTotal) * item.quantity;
  }, 0), [items]);

  const addToCart = (product: MenuProduct) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }

      return [...current, { ...product, quantity: 1 }];
    });
  };

  const goToMenu = () => {
    setScreen("menu");
  };

  const goToConfirmation = () => {
    if (!cart.length) return;
    setScreen("confirmation");
  };

  const confirmOrder = () => {
    const newItems: TableItem[] = cart.map((item) => ({
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    setItems((current) => [...current, ...newItems]);
    setCart([]);
    setScreen("table");
    setTab("items");
  };

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(menuX, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuX, {
      toValue: -320,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  };

  const goBack = () => {
    if (deleteMode) {
      setDeleteMode(false);
      setSelectedItems([]);
      return;
    }

    if (menuOpen) {
      closeMenu();
      return;
    }

    if (screen === "confirmation") {
      setScreen("menu");
      return;
    }

    if (screen === "menu") {
      setScreen("table");
      return;
    }

    onBack();
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  const deleteSelectedItems = () => {
    if (!selectedItems.length) return;

    setItems((current) => current.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setDeleteMode(false);
  };

  const openDeleteMode = () => {
    closeMenu();
    setDeleteMode(true);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });

    return () => subscription.remove();
  }, [screen, menuOpen, deleteMode, selectedItems]);

  if (screen === "menu") {
    return (
      <TableMenuScreen
        products={mockProducts}
        cart={cart}
        onBack={goBack}
        onAdd={addToCart}
        onContinue={goToConfirmation}
      />
    );
  }

  if (screen === "confirmation") {
    return (
      <OrderConfirmationScreen
        table={table}
        cart={cart}
        onBack={goBack}
        onConfirm={confirmOrder}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background">
        <XStack alignItems="center" padding="$3" gap="$3">
          <Button size="$3" circular chromeless onPress={openMenu}>
            <Ionicons name="menu-outline" size={26} />
          </Button>

          <YStack flex={1}>
            <Text fontSize="$7" fontWeight="800">Mesa {table.number}</Text>
            <Text fontSize="$3" color="$color10">{items.length} itens</Text>
          </YStack>

          <Text fontSize="$5" fontWeight="800">{formatCurrency(tableTotal)}</Text>
        </XStack>

        <Separator />

        {deleteMode ? (
          <YStack flex={1}>
            <XStack alignItems="center" justifyContent="space-between" padding="$3">
              <Text fontSize="$5" fontWeight="800">Excluir produtos</Text>
              <Text fontSize="$3" color="$color10">{selectedItems.length} selecionados</Text>
            </XStack>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
              <YStack gap="$2">
                {items.map((item) => {
                  const selected = selectedItems.includes(item.id);
                  const additionalsTotal = item.additionals?.reduce((total, additional) => total + additional.price, 0) ?? 0;
                  const unitTotal = item.price + additionalsTotal;
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
                          name={selected ? "checkmark-circle" : "ellipse-outline"}
                          size={25}
                          color={selected ? "red" : undefined}
                        />

                        <YStack flex={1}>
                          <Text fontSize="$4" fontWeight="700">{item.name}</Text>
                          <Text fontSize="$3" color="$color10">
                            {formatCurrency(unitTotal)} × {item.quantity}
                          </Text>
                        </YStack>

                        <Text fontSize="$4" fontWeight="800">{formatCurrency(total)}</Text>
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
                onPress={deleteSelectedItems}
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 12 }}>
                  <YStack gap="$2">
                    {items.map((item) => {
                      const additionalsTotal = item.additionals?.reduce((total, additional) => total + additional.price, 0) ?? 0;
                      const unitTotal = item.price + additionalsTotal;
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
                          <XStack justifyContent="space-between" alignItems="center">
                            <YStack flex={1} gap="$1">
                              <Text fontSize="$4" fontWeight="700">{item.name}</Text>

                              {item.additionals?.map((additional) => (
                                <Text key={additional.name} fontSize="$2" color="$color10">
                                  + {additional.name} {formatCurrency(additional.price)}
                                </Text>
                              ))}

                              <Text fontSize="$3" color="$color10">
                                {formatCurrency(unitTotal)} × {item.quantity}
                              </Text>
                            </YStack>

                            <Text fontSize="$4" fontWeight="800">{formatCurrency(total)}</Text>
                          </XStack>
                        </Card>
                      );
                    })}
                  </YStack>
                </ScrollView>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 12 }}>
                  <YStack gap="$3">
                    <Card padding="$4" borderRadius="$4" backgroundColor="$gray1">
                      <YStack gap="$3">
                        <XStack justifyContent="space-between">
                          <Text>Subtotal</Text>
                          <Text>{formatCurrency(tableTotal)}</Text>
                        </XStack>

                        <XStack justifyContent="space-between">
                          <Text>Serviço 10%</Text>
                          <Text>{formatCurrency(tableTotal * 0.1)}</Text>
                        </XStack>

                        <Separator />

                        <XStack justifyContent="space-between">
                          <Text fontSize="$5" fontWeight="800">Total</Text>
                          <Text fontSize="$5" fontWeight="800">{formatCurrency(tableTotal * 1.1)}</Text>
                        </XStack>
                      </YStack>
                    </Card>
                  </YStack>
                </ScrollView>
              )}
            </YStack>

            {tab === "items" ? (
              <YStack paddingHorizontal="$3" paddingVertical="$2">
                <Button height={48} borderRadius="$4" backgroundColor="$blue10" onPress={goToMenu}>
                  <Ionicons color="white" name="add" size={20} />
                  <Text color="white">Lançar produto</Text>
                </Button>
              </YStack>
            ) : (
              <YStack paddingHorizontal="$3" paddingVertical="$2">
                <Button height={48} borderRadius="$4" backgroundColor="$red9" color="white" onPress={() => {}}>
                  <Text color="white">Fechar conta</Text>
                </Button>
              </YStack>
            )}

            <XStack backgroundColor="$background" borderTopWidth={1} borderColor="$borderColor" padding="$2" paddingBottom="$3">
              <Button flex={1} chromeless onPress={() => setTab("items")}>
                <YStack alignItems="center" gap="$1">
                  <Ionicons name="receipt-outline" size={22} />
                  <Text fontSize="$2" fontWeight={tab === "items" ? "800" : "400"}>Itens</Text>
                </YStack>
              </Button>

              <Button flex={1} chromeless onPress={() => setTab("bill")}>
                <YStack alignItems="center" gap="$1">
                  <Ionicons name="wallet-outline" size={22} />
                  <Text fontSize="$2" fontWeight={tab === "bill" ? "800" : "400"}>Conta</Text>
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
            <YStack flex={1} backgroundColor="$background" padding="$4" gap="$2">
              <XStack alignItems="center" justifyContent="space-between" paddingBottom="$3">
                <Text fontSize="$6" fontWeight="800">Menu</Text>

                <Button size="$3" circular chromeless onPress={closeMenu}>
                  <Ionicons name="close" size={24} />
                </Button>
              </XStack>

              <Separator />

              <Button justifyContent="flex-start" height={52} chromeless onPress={openDeleteMode}>
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