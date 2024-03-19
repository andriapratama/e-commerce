import axios from "axios";
import useSWR, { Fetcher } from "swr";

import { CategoryFullType } from "@/types/CategoryType";

export const useGetAllCategoriesHook = () => {
  const fetcher: Fetcher<{ data: CategoryFullType[]; message: string }> = (
    url: string
  ) => axios.get(url).then((res) => res.data);

  const category = useSWR("/api/categories", fetcher);

  return { ...category };
};
