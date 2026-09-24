export interface BaseEntity {
  id: string;
  createdAt: Date;
}

export interface Restaurant extends BaseEntity {
  name: string;
  email: string;
  address: string;
}

export enum UserRole {
  WAITER = "Garçom",
  MANAGER = "Gerente",
}

export interface User extends BaseEntity {
  name: string;
  password: string;
  type: UserRole;
}

export interface RestaurantTable extends BaseEntity {
  restaurantRef: string;
  number: number;
}

export interface MenuItem extends BaseEntity {
  title: string;
  price: number;
}

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

export interface Order extends BaseEntity {
  orderItemSnapshot: OrderItemSnapshot[];
  status: OrderStatus;
  isPaid: boolean;
  restaurantTableRef: string;
}
