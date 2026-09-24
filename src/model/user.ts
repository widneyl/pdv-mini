import { BaseEntity } from "@/model/baseEntity";

export enum UserRole {
  WAITER = "Garçom",
  MANAGER = "Gerente",
}

export interface User extends BaseEntity {
  name: string;
  password: string;
  type: UserRole;
  restaurantRef: string;
}