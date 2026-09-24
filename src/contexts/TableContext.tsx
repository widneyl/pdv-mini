import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockItems } from "@/data/mockData";
import type { CartItem, MenuProduct, TableItem } from "@/model/tableTypes";

interface TableContextValue {
  items: TableItem[];
  cart: CartItem[];
  tableTotal: number;
  addToCart: (product: MenuProduct) => void;
  confirmOrder: () => void;
  deleteSelectedItems: (ids: string[]) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

export function TableProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TableItem[]>(mockItems);
  const [cart, setCart] = useState<CartItem[]>([]);

  const tableTotal = useMemo(
    () =>
      items.reduce((total, item) => {
        const additionalsTotal = item.additionals?.reduce((sum, additional) => sum + additional.price, 0) ?? 0;
        return total + (item.price + additionalsTotal) * item.quantity;
      }, 0),
    [items]
  );

  const addToCart = (product: MenuProduct) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const confirmOrder = () => {
    const newItems: TableItem[] = cart.map((item) => ({
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    setItems((current) => [...current, ...newItems]);
    setCart([]);
  };

  const deleteSelectedItems = (ids: string[]) => {
    setItems((current) => current.filter((item) => !ids.includes(item.id)));
  };

  return (
    <TableContext.Provider value={{ items, cart, tableTotal, addToCart, confirmOrder, deleteSelectedItems }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable(): TableContextValue {
  const context = useContext(TableContext);
  if (!context) throw new Error("useTable must be used within TableProvider");
  return context;
}