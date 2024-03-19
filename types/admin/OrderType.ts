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

export interface OrderDetailType {
  name: string;
  price: number;
  quantity: number;
  total: number;
  product?: {
    image: string;
  };
  promo?: {
    image: string;
  };
}

export interface OrderType {
  discount: number | null;
  employeeName: string | null;
  grandTotal: number | null;
  invoice: string;
  note: string | null;
  paymentMethod: "cash" | "transfer";
  shipping: number | null;
  statusOrder: "new" | "ongoing" | "done" | "cancel";
  statuspayment: "pending" | "paid";
  subTotal: number | null;
  tax: number | null;
  totalItem: number;
  user: {
    address: string | null;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  orderDetail: OrderDetailType[];
  createdAt: Date;
}

export interface OrderLogType {
  status:
    | "new"
    | "open"
    | "invoice"
    | "paid"
    | "delivery"
    | "accepted"
    | "done"
    | "cancel";
  employeeName: string;
  createdAt: Date;
}
