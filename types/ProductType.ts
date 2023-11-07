export interface ProductType {
  name: string;
  slug: string;
  totalStock: number;
  minimumStock: number;
  price: number;
  cost: number;
  netFill: number;
  status: string;
  linkGojek: string | null;
  description: string | null;
  salePrice: number;
  category: { name: string };
  image: string;
  createdAt: string | Date;
}
