import { BaseEntity } from "@/model/baseEntity";
import { Order } from "./order";

export interface RestaurantTableResponse extends BaseEntity {
  restaurantRef: string;
  number: number;
  order: Order | undefined;
}