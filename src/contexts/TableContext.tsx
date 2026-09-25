import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { MenuItem } from "@/model/menuItem";
import { OrderStatus, type CreateOrderDto, type OrderItemSnapshot } from "@/model/order";

interface TableContextValue {
  cart: OrderItemSnapshot[];
  addToCart: (product: MenuItem) => void;
  decrementFromCart: (title: string) => void;
  clearCart: () => void;
  confirmOrder: () => CreateOrderDto;
}

const TableContext = createContext<TableContextValue | null>(null);

const generateId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

export function TableProvider({ tableId, children }: { tableId: string; children: ReactNode }) {
  const [cart, setCart] = useState<OrderItemSnapshot[]>([]);

  const addToCart = (product: MenuItem) => {
    setCart((current) => {
      const existing = current.find((item) => item.title === product.title);
      if (existing) {
        return current.map((item) => (item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [
        ...current,
        {
          id: generateId(),
          title: product.title,
          price: product.price,
          quantity: 1,
          createdAt: new Date(),
        },
      ];
    });
  };

  const decrementFromCart = (title: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.title === title);
      if (!existing) return current;
      if (existing.quantity <= 1) {
        return current.filter((item) => item.title !== title);
      }
      return current.map((item) =>
        item.title === title ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const clearCart = useCallback(() => setCart([]), []);

  const confirmOrder = (): CreateOrderDto => {
    const dto: CreateOrderDto = {
      orderItemSnapshot: cart,
      status: OrderStatus.OCCUPIED,
      isPaid: false,
      restaurantTableRef: tableId,
    };
    setCart([]);
    return dto;
  };

  return (
    <TableContext.Provider value={{ cart, addToCart, decrementFromCart, clearCart, confirmOrder }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable(): TableContextValue {
  const context = useContext(TableContext);
  if (!context) throw new Error("useTable must be used within TableProvider");
  return context;
}