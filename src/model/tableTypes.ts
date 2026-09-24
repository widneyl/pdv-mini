export interface TableItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  additionals?: { name: string; price: number }[];
}

export interface MenuProduct {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface CartItem extends MenuProduct {
  quantity: number;
}