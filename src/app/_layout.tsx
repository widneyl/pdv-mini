import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../../tamagui.config";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <Stack screenOptions={{ headerShown: false }} />
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}