export interface ProductType {
  id: string;
  image: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  status: "active" | "archive";
  sale: "true" | "false";
}
