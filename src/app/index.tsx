import { WaiterPOSScreen } from "@/components/WaiterScreen";
import { RestaurantTable } from "@/types/types";

const tables: RestaurantTable[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  createdAt: new Date(),
  restaurantRef: "1",
  number: i + 1,
}));

export default function HomeScreen() {
  return <WaiterPOSScreen tables={tables} />;
}