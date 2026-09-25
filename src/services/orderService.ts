import { CreateOrderDto, Order, OrderItemSnapshot } from "@/model/order";
import { api } from "@/services/api";

export class OrderService {
  async getById(id: string): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  }

  async create(input: CreateOrderDto): Promise<Order> {
    const { data } = await api.post<Order>("/orders", input);
    return data;
  }

  async update(id: string, input: Partial<CreateOrderDto>): Promise<Order> {
    const { data } = await api.put<Order>(`/orders/${id}`, input);
    return data;
  }

  async close(id: string) {
    await api.put<Order>(`/orders/close/${id}`);
  }

  async addOrderItem(
    id: string,
    input: { orderItemSnapshot: OrderItemSnapshot[] },
  ): Promise<Order> {
    const { data } = await api.put<Order>(`/orders/add-items/${id}`, input);
    return data;
  }

  async removeOrderItem(
    id: string,
    input: { orderItemSnapshot: OrderItemSnapshot[] },
  ): Promise<Order> {
    const { data } = await api.put<Order>(`/orders/remove-items/${id}`, input);
    return data;
  }
}

export const orderService = new OrderService();
