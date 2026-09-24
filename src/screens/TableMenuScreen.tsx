import { useTable } from "@/contexts/TableContext";
import { MenuItem } from "@/model/menuItem";
import type { TableStackParamList } from "@/navigation/types";
import { menuItemService } from "@/services/menuItem.service";
import { formatCurrency } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";

type Props = NativeStackScreenProps<TableStackParamList, "Menu">;

export function TableMenuScreen({ navigation, route }: Props) {
  const { id, number } = route.params;

  const [products, setProducts] = useState<MenuItem[]>([]);

  const getMenuItems = async () => {
    const result = await menuItemService.list();
    setProducts(result);
  };

  useFocusEffect(
    useCallback(() => {
      getMenuItems();
    }, []),
  );

  const [search, setSearch] = useState("");
  const { cart, addToCart, decrementFromCart } = useTable();

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(value),
    );
  }, [products, search]);

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background">
        <XStack padding="$3" alignItems="center" gap="$3">
          <Button
            size="$3"
            circular
            chromeless
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} />
          </Button>
          <YStack flex={1}>
            <Text fontSize="$7" fontWeight="800">
              Cardápio
            </Text>
            <Text fontSize="$3" color="$color10">
              Adicione os produtos à mesa
            </Text>
          </YStack>
        </XStack>

        <YStack flex={1} paddingHorizontal="$3" gap="$3">
          <XStack
            alignItems="center"
            backgroundColor="$gray3"
            borderRadius="$5"
            paddingHorizontal="$3"
          >
            <Ionicons name="search" size={20} />
            <Input
              flex={1}
              borderWidth={0}
              backgroundColor="transparent"
              placeholder="Buscar produto..."
              value={search}
              onChangeText={setSearch}
            />
          </XStack>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <YStack gap="$2">
              {filteredProducts.map((product) => {
                const quantity =
                  cart.find((item) => item.title === product.title)
                    ?.quantity ?? 0;

                return (
                  <Card
                    key={product.id}
                    padding="$3"
                    borderRadius="$5"
                    backgroundColor="$gray1"
                    borderWidth={1}
                    borderColor="$borderColor"
                    onPress={() => addToCart(product)}
                  >
                    <XStack alignItems="center" justifyContent="space-between">
                      <YStack flex={1} gap="$1">
                        <Text fontSize="$4" fontWeight="800">
                          {product.title}
                        </Text>
                        <Text fontSize="$4" fontWeight="700">
                          {formatCurrency(product.price)}
                        </Text>
                      </YStack>
                      {quantity > 0 && (
                        <XStack alignItems="center" gap="$2">
                          <Button
                            size="$3"
                            circular
                            chromeless
                            onPress={() => decrementFromCart(product.title)}
                          >
                            <Ionicons name="remove" size={18} />
                          </Button>
                          <Text fontWeight="800">x{quantity}</Text>
                          <Button
                            size="$3"
                            circular
                            chromeless
                            onPress={() => addToCart(product)}
                          >
                            <Ionicons name="add" size={18} />
                          </Button>
                        </XStack>
                      )}
                    </XStack>
                  </Card>
                );
              })}
            </YStack>
          </ScrollView>
        </YStack>

        {cartQuantity > 0 && (
          <YStack position="absolute" left={12} right={12} bottom={12}>
            <Button
              size="$5"
              borderRadius="$5"
              backgroundColor="$blue10"
              color="white"
              onPress={() =>
                navigation.navigate("Confirmation", { id, number })
              }
            >
              <XStack
                width="100%"
                justifyContent="space-between"
                alignItems="center"
                paddingHorizontal="$2"
              >
                <Text color="white" fontWeight="800">
                  {cartQuantity} itens
                </Text>
                <Text color="white" fontWeight="800">
                  Revisar pedido →
                </Text>
              </XStack>
            </Button>
          </YStack>
        )}
      </YStack>
    </SafeAreaView>
  );
}
