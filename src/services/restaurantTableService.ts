import { RestaurantTable } from "@/model/restaurantTable";
import { api } from "@/services/api";

export class RestaurantTableService {
  async list(): Promise<RestaurantTable[]> {
    const { data } = await api.get<RestaurantTable[]>("/restaurant-tables");
    return data;
  }

  async getById(id: string): Promise<RestaurantTable> {
    const { data } = await api.get<RestaurantTable>(`/restaurant-tables/${id}`);
    return data;
  }

  async createMany(quantity: number){
    await api.post<RestaurantTable>(
      "/restaurant-tables/bulk",
      {
        quantity,
      },
    );
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/restaurant-tables/${id}`);
  }
}

export const restaurantTableService = new RestaurantTableService();
