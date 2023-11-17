import { CategoryType } from "@/types/CategoryType";
import axios from "axios";

export const useGetAllCategoriesHook = async () => {
  const categoriesRes = await axios.get(
    `${process.env.WEB_URL}/api/categories`
  );

  const categories: CategoryType[] = categoriesRes.data.data;

  return { categories };
};
