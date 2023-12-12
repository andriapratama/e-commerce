import axios from "axios";
import { toast } from "react-toastify";
import { SubCategoryType } from "@/types/CategoryType";
import { useCallback, useEffect, useState } from "react";

export const useGetSubCategoryHook = () => {
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const getSubCategories = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/sub-categories/get");

      const subCategories: SubCategoryType[] = res.data.data;

      setSubCategories(subCategories);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.error);
      setIsLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    getSubCategories();
  }, [getSubCategories]);

  return {
    subCategories,
    setSubCategories,
    isLoadingContent,
    setIsLoadingContent,
    getSubCategories,
  };
};
