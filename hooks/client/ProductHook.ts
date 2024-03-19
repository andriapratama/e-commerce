import axios from "axios";

import { ClientProductType } from "@/types/ProductType";

export const useGetProductDetailHook = async (id: string) => {
  const productRes = await axios.get(
    `${process.env.WEB_URL}/api/products/${id}`
  );

  const product: ClientProductType = productRes.data.data;

  return { product };
};

export const useGetAllProductsHook = async (
  category?: string,
  subCategory?: string,
  status?: string,
  page?: string
) => {
  const api = `${process.env.WEB_URL}/api/products/get`;

  let router = "";

  if (category && subCategory) {
    router = `${api}?category=${category}&subCategory=${subCategory}&page=${page}`;
  } else if (category) {
    router = `${api}?category=${category}&page=${page}`;
  } else if (status) {
    router = `${api}?status=${status}&page=${page}`;
  } else if (page) {
    router = `${api}?page=${page}`;
  } else {
    router = api;
  }

  const productsRes = await axios.get(router);

  const products: ClientProductType[] = productsRes.data.data.products;
  const totalPage: number = productsRes.data.data.totalPage;

  return { products, totalPage };
};
