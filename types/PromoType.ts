export interface PromoType {
  createdAt: Date;
  description: string;
  firstPrice: number;
  image: string;
  imagePathname: string;
  name: string;
  promoPrice: number;
  slug: string;
  status: "active" | "archive";
}

export interface PromoProductType {
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
  product: { image: string };
}
