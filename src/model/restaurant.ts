import { BaseEntity } from "@/model/baseEntity";

export interface Restaurant extends BaseEntity {
  name: string;
  email: string;
  address: string;
}