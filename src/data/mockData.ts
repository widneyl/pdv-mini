import type { MenuProduct, TableItem } from "@/model/tableTypes";

export const mockItems: TableItem[] = [
  { id: "1", name: "Picanha", quantity: 2, price: 45, additionals: [{ name: "Farofa", price: 5 }] },
  { id: "2", name: "Cerveja Heineken", quantity: 3, price: 10 },
  { id: "3", name: "Refrigerante", quantity: 2, price: 7 },
];

export const mockProducts: MenuProduct[] = [
  { id: "1", name: "Picanha", category: "Carnes", price: 45 },
  { id: "2", name: "Filé com fritas", category: "Carnes", price: 38 },
  { id: "3", name: "Cerveja Heineken", category: "Bebidas", price: 10 },
  { id: "4", name: "Cerveja Budweiser", category: "Bebidas", price: 9 },
  { id: "5", name: "Refrigerante", category: "Bebidas", price: 7 },
  { id: "6", name: "Batata frita", category: "Porções", price: 18 },
  { id: "7", name: "Calabresa acebolada", category: "Porções", price: 25 },
];