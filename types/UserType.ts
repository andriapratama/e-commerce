export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  role: "member" | "guest";
  address: string | null;
  phone: string | null;
  active: boolean;
}

export interface AdminUserType extends UserType {
  id: string;
}

export interface AdminUserOrderType {
  invoice: string;
  statusOrder: "new" | "ongoing" | "done" | "cancel";
  paymentMethod: "cash" | "transfer";
  statuspayment: "pending" | "paid";
  grandTotal: number;
  totalItem: number;
  createdAt: Date;
}
