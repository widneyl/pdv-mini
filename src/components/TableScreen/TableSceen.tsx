import { useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Separator, Text, XStack, YStack } from "tamagui";
import type { RestaurantTable } from "@/types/types";
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

  const tableTotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);

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

  const goBack = () => {
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

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });

    return () => subscription.remove();
  }, [screen]);

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
          <Button size="$3" circular chromeless onPress={goBack}>
            <Ionicons name="arrow-back" size={24} />
          </Button>
          <YStack flex={1}>
            <Text fontSize="$7" fontWeight="800">Mesa {table.number}</Text>
            <Text fontSize="$3" color="$color10">{items.length} itens</Text>
          </YStack>
          <Text fontSize="$5" fontWeight="800">{formatCurrency(tableTotal)}</Text>
        </XStack>

        <Separator />

        <YStack flex={1}>
          {tab === "items" ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 12 }}>
              <YStack gap="$2">
                {items.map((item) => {
                  const additionalsTotal = item.additionals?.reduce((total, additional) => total + additional.price, 0) ?? 0;
                  const unitTotal = item.price + additionalsTotal;
                  const total = unitTotal * item.quantity;

                  return (
                    <Card key={item.id} padding="$3" borderRadius="$4" backgroundColor="$gray1" borderWidth={1} borderColor="$borderColor">
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
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

                <Button variant="outlined" onPress={() => {}}>
                  <Ionicons name="add" size={20} />
                  Adicionar acréscimo
                </Button>

                <Button theme="red" onPress={() => {}}>
                  Fechar conta
                </Button>
              </YStack>
            </ScrollView>
          )}
        </YStack>

        {tab === "items" && (
          <YStack paddingHorizontal="$3" paddingVertical="$2">
            <Button height={48} borderRadius="$4" backgroundColor="$blue10" onPress={goToMenu}>
              <Ionicons color="white" name="add" size={20} />
              <Text color="white">Lançar produto</Text>
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
      </YStack>
    </SafeAreaView>
  );
}