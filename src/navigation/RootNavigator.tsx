import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@/screens/LoginScreen";
import { WaiterSelectScreen } from "@/screens/WaiterSelectScreen";
import { PosNavigator } from "./PosNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="WaiterSelect" component={WaiterSelectScreen} />
      <Stack.Screen name="Pos" component={PosNavigator} />
    </Stack.Navigator>
  );
}