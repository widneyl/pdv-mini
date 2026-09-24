import { RestaurantTableResponse } from "@/model/restaurantTable";
import { api } from "@/services/api";

export class RestaurantTableService {
  async list(): Promise<RestaurantTableResponse[]> {
    const { data } = await api.get<RestaurantTableResponse[]>("/restaurant-tables");
    return data;
  }

  async getById(id: string): Promise<RestaurantTableResponse> {
    const { data } = await api.get<RestaurantTableResponse>(`/restaurant-tables/${id}`);
    return data;
  }

  async createMany(quantity: number){
    await api.post<RestaurantTableResponse>(
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
