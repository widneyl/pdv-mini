import { BaseEntity } from "@/model/baseEntity";

export interface RestaurantTable extends BaseEntity {
  restaurantRef: string;
  number: number;
  status?: "FREE" | "OCCUPIED" | "CLOSED";
}