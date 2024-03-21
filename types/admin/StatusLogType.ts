export interface StatusLogType {
  createdAt: Date;
  employee: { name: string };
  note: string;
  salePrice: number;
  status: "new" | "active" | "sale" | "best" | "archive";
}
