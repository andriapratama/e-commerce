type Status = "new" | "active" | "best" | "sale" | "archive";

interface ProductInCartType {
  name: string;
  price: number;
  salePrice: number;
  status: Status;
  totalStock: number;
  image: string;
  slug: string;
}

export interface CartType {
  id: string;
  quantity: number;
  total: number;
  product: ProductInCartType;
  createdAt: string;
  status: boolean;
  isLoading?: boolean;
}
