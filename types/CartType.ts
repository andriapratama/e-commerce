interface ProductInCartType {
  name: string;
  price: number;
  salePrice: number;
  status: "new" | "active" | "best" | "sale" | "archive";
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
}
