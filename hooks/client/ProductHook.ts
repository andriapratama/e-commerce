import { ClientProductType } from "@/types/ProductType";
import axios from "axios";

export const useGetProductDetailHook = async (id: string) => {
  const productRes = await axios.get(
    `${process.env.WEB_URL}/api/products/${id}`
  );

  const product: ClientProductType = productRes.data.data;

  return { product };
};

export const useGetAllProductsHook = async () => {
  const productsRes = await axios.get(`${process.env.WEB_URL}/api/products`);

  const products: ClientProductType[] = productsRes.data.data;

  return { products };
};

export const useGetSpecialProductsHook = async () => {
  const productsRes = await axios.get(
    `${process.env.WEB_URL}/api/products/special`
  );

  const products: ClientProductType[] = productsRes.data.data;

  return { products };
};
