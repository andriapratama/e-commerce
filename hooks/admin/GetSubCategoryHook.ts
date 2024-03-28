import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr";

import { SubCategoryType } from "@/types/CategoryType";

export const useGetSubCategoryHook = (category?: string) => {
  const [route, setRoute] = useState<string>("");

  const [subCategory, setSubCategory] = useState<string>("");

  const fetcher: Fetcher<{
    data: SubCategoryType[] | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(route, fetcher);

  useEffect(() => {
    if (category) {
      setRoute(`/api/admin/sub-categories/get?category=${category}`);
    } else {
      setRoute(`/api/admin/sub-categories/get`);
    }
  }, [category]);

  return {
    subCategory,
    setSubCategory,
    subCategories: data?.data,
    isLoadingContent: isLoading,
  };
};
