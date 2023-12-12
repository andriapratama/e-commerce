export interface StatusLogType {
  createdAt: string;
  employee: { name: string };
  note: string;
  salePrice: number;
  status: "new" | "active" | "sale" | "best" | "archive";
}
