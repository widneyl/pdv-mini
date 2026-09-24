import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Separator, Text, XStack, YStack } from "tamagui";
import type { RestaurantTable } from "@/types/types";
import { CartItem } from "./TableSceen";

interface OrderConfirmationScreenProps {
  table: RestaurantTable;
  cart: CartItem[];
  onBack: () => void;
  onConfirm: () => void;
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`;

export function OrderConfirmationScreen({ table, cart, onBack, onConfirm }: OrderConfirmationScreenProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background">
        <XStack padding="$3" alignItems="center" gap="$3">
          <Button size="$3" circular chromeless onPress={onBack}>
            <Ionicons name="arrow-back" size={22} />
          </Button>
          <YStack flex={1}>
            <Text fontSize="$7" fontWeight="800">Confirmar pedido</Text>
            <Text fontSize="$3" color="$color10">Mesa {table.number}</Text>
          </YStack>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, paddingBottom: 120 }}>
          <YStack gap="$2">
            {cart.map((item) => (
              <Card key={item.id} padding="$3" borderRadius="$5" backgroundColor="$gray1" borderWidth={1} borderColor="$borderColor">
                <XStack alignItems="center">
                  <YStack flex={1} gap="$1">
                    <Text fontSize="$4" fontWeight="800">{item.name}</Text>
                    <Text fontSize="$3" color="$color10">{item.quantity} × {formatCurrency(item.price)}</Text>
                  </YStack>
                  <Text fontSize="$4" fontWeight="800">{formatCurrency(item.price * item.quantity)}</Text>
                </XStack>
              </Card>
            ))}
          </YStack>
        </ScrollView>

        <YStack padding="$3" borderTopWidth={1} borderTopColor="$borderColor" backgroundColor="$background" gap="$3">
          <XStack justifyContent="space-between">
            <Text color="$color10">{quantity} itens</Text>
            <Text fontSize="$5" fontWeight="800">{formatCurrency(total)}</Text>
          </XStack>
          <Button size="$5" borderRadius="$5" backgroundColor="$green10" color="white" onPress={onConfirm}>
            Confirmar e lançar na mesa
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}