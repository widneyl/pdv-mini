export type RootStackParamList = {
  Login: undefined;
  WaiterSelect: undefined;
  Pos: undefined;
};

export type PosStackParamList = {
  Tables: undefined;
  Settings: undefined;
  TablesSettings: undefined;
  Table: { id: string; number: number };
};

export type TableStackParamList = {
  TableDetail: { id: string; number: number };
  Menu: { id: string; number: number; orderId?: string };
  Confirmation: { id: string; number: number; orderId?: string };
};