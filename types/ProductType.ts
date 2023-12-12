export interface AdminProductType {
  name: string;
  slug: string;
  totalStock: number;
  minimumStock: number;
  price: number;
  cost: number;
  netFill: number;
  status: "new" | "active" | "best" | "sale" | "archive";
  linkGojek: string;
  description: string;
  salePrice: number;
  category: { name: string };
  subCategory: { name: string } | null;
  image: string;
  createdAt: string;
}

export interface ClientProductType {
  name: string;
  slug: string;
  totalStock: number;
  minimumStock: number;
  price: number;
  cost: number;
  netFill: number;
  status: "new" | "active" | "best" | "sale" | "archive";
  linkGojek: string | null;
  description: string | null;
  salePrice: number;
  category: { name: string };
  subCategory: { name: string } | null;
  image: string;
  createdAt: string | Date;
}
