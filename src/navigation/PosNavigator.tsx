import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TablesProvider } from "@/contexts/TablesContext";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { TablesScreen } from "@/screens/TablesScreen";
import { TablesSettingsScreen } from "@/screens/TablesSettingsScreen";
import { TableNavigator } from "./TableNavigator";
import type { PosStackParamList } from "./types";

const Stack = createNativeStackNavigator<PosStackParamList>();

export function PosNavigator() {
  return (
    <TablesProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tables" component={TablesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="TablesSettings" component={TablesSettingsScreen} />
        <Stack.Screen name="Table" component={TableNavigator} />
      </Stack.Navigator>
    </TablesProvider>
  );
}