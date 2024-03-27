import axios from "axios";
import { useState } from "react";
import useSWR, { Fetcher } from "swr";

import { CategoryType } from "@/types/CategoryType";

export const useGetCategoriesHook = () => {
  const [category, setCategory] = useState<string>("");

  const fetcher: Fetcher<{
    data: CategoryType[] | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR("/api/admin/categories/get", fetcher);

  return {
    category,
    setCategory,
    categories: data?.data,
    isLoadingContent: isLoading,
  };
};
