type ProductStatus = "new" | "active" | "best" | "sale" | "archive";

type PromoStatus = "active" | "archive" | "deleted";

interface ProductInCartType {
  name: string;
  price: number;
  salePrice: number;
  status: ProductStatus;
  totalStock: number;
  image: string;
  slug: string;
}

interface PromoInCartType {
  name: string;
  firstPrice: number;
  promoPrice: number;
  status: PromoStatus;
  image: string;
  slug: string;
}

export interface CartType {
  id: string;
  quantity: number;
  total: number;
  product?: ProductInCartType;
  promo?: PromoInCartType;
  createdAt: string;
  status: boolean;
  isLoading?: boolean;
}

export interface CartLocalType {
  image: string;
  name: string;
  slug: string;
  status: boolean;
  price: number;
  salePrice: number;
  quantity: number;
  type: "product" | "promo";
  totalStock: number;
  createdAt: Date;
}
