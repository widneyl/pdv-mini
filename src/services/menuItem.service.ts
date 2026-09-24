import { MenuItem } from "@/model/menuItem";
import { api } from "@/services/api";

export class MenuItemService {
  async list(): Promise<MenuItem[]> {
    const { data } = await api.get<MenuItem[]>("/menu-items");
    return data;
  }
}

export const menuItemService = new MenuItemService();
