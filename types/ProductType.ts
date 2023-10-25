export interface ProductType {
  name: string;
  slug: string;
  totalStock: number;
  minimumStock: number;
  price: number;
  cost: number;
  netFill: number;
  status: string;
  linkGojek: string;
  description: string;
  sale: string;
  salePrice: number;
  category: { name: string };
  image: string;
  createdAt: string;
}
