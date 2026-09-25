import { BaseEntity } from "@/model/baseEntity";

export interface MenuItem extends BaseEntity {
  title: string;
  price: number;
}