export interface OrdersType {
  invoice: string;
  statusOrder: "new" | "ongoing" | "done" | "cancel";
  paymentMethod: "cash" | "transfer";
  statuspayment: "pending" | "paid";
  grandTotal: number;
  userName: string;
  userPhone: string;
  userEmail: string;
  totalItem: number;
  createdAt: string;
}
