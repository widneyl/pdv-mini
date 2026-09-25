import { BaseEntity } from "@/model/baseEntity";
import { MenuItem } from "@/model/menuItem";

export enum OrderStatus {
  FREE = "Livre",
  OCCUPIED = "Ocupada",
  CLOSED = "Fechada",
}

export interface OrderItemSnapshot extends Pick<MenuItem, "price" | "title"> {
  id: string;
  quantity: number;
  createdAt: Date;
}

export interface CreateOrderDto {
  orderItemSnapshot: OrderItemSnapshot[];
  status: OrderStatus;
  isPaid: boolean;
  restaurantTableRef: string;
}

export interface Order extends BaseEntity {
  orderItemSnapshot: OrderItemSnapshot[];
  status: OrderStatus;
  isPaid: boolean;
  restaurantTableRef: string;
}