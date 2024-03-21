export interface StockLogType {
  createdAt: Date;
  employee: { name: string };
  note: string;
  previousStock: number;
  status: "first" | "update" | "decrease" | "increase";
  stock: number;
  stockNow: number;
}
