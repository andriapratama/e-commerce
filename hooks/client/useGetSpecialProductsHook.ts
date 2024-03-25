import axios from "axios";

import { ClientProductType } from "@/types/ProductType";

export const useGetSpecialProductsHook = async (
  status: "best" | "new" | "sale"
) => {
  const res = await axios.get(
    `${process.env.WEB_URL}/api/products/get?status=${status}`
  );

  const products: ClientProductType[] = res.data.data.products;

  return { products };
};
