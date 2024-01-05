import axios from "axios";
import { toast } from "react-toastify";
import { SubCategoryType } from "@/types/CategoryType";
import { useCallback, useEffect, useState } from "react";

export const useGetSubCategoryHook = (category?: string) => {
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);

  const [subCategory, setSubCategory] = useState<string>("");

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const getSubCategories = useCallback(async () => {
    try {
      let route = "";

      if (category) {
        route = `/api/admin/sub-categories/get?category=${category}`;
      } else {
        route = `/api/admin/sub-categories/get`;
      }

      const res = await axios.get(route);

      const subCategories: SubCategoryType[] = res.data.data;

      setSubCategories(subCategories);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.error);
      setIsLoadingContent(false);
    }
  }, [category]);

  useEffect(() => {
    getSubCategories();
  }, [getSubCategories]);

  return {
    subCategory,
    setSubCategory,
    subCategories,
    setSubCategories,
    isLoadingContent,
    setIsLoadingContent,
    getSubCategories,
  };
};
