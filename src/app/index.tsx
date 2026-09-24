import { useState } from "react";
import { RestaurantTable } from "@/types/types";
import { LoginScreen } from "@/pages/LoginScreen";
import { WaiterSelectScreen } from "@/pages/WaiterSelectScreen";
import { WaiterPOSScreen } from "@/pages/WaiterPOSScreen";

const tables: RestaurantTable[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  createdAt: new Date(),
  restaurantRef: "1",
  number: i + 1,
  status: "CLOSED",
}));

const waiters = [
  { id: "1", name: "João" },
  { id: "2", name: "Maria" },
  { id: "3", name: "Carlos" },
  { id: "4", name: "Ana" },
];

type Screen = "login" | "waiter" | "pos";

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>("login");

  if (screen === "login") {
    return <LoginScreen onLogin={() => setScreen("waiter")} />;
  }

  if (screen === "waiter") {
    return (
      <WaiterSelectScreen
        waiters={waiters}
        onBack={() => setScreen("login")}
        onConfirm={() => setScreen("pos")}
      />
    );
  }

  return <WaiterPOSScreen tables={tables} onLogout={() => setScreen("login")} />;
}