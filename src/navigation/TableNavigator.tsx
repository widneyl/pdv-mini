import { createNativeStackNavigator, type NativeStackScreenProps } from "@react-navigation/native-stack";
import { TableProvider } from "@/contexts/TableContext";
import { OrderConfirmationScreen } from "@/screens/OrderConfirmationScreen";
import { TableMenuScreen } from "@/screens/TableMenuScreen";
import { TableScreen } from "@/screens/TableScreen";
import type { PosStackParamList, TableStackParamList } from "./types";

const Stack = createNativeStackNavigator<TableStackParamList>();

type Props = NativeStackScreenProps<PosStackParamList, "Table">;

export function TableNavigator({ route }: Props) {
  const { id, number } = route.params;

  return (
    <TableProvider tableId={id}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TableDetail" component={TableScreen} initialParams={{ id, number }} />
        <Stack.Screen name="Menu" component={TableMenuScreen} initialParams={{ id, number }} />
        <Stack.Screen name="Confirmation" component={OrderConfirmationScreen} initialParams={{ id, number }} />
      </Stack.Navigator>
    </TableProvider>
  );
}