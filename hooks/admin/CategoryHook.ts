import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { CategoryType } from "@/types/CategoryType";

export const useGetCategoriesHook = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const getCategories = async () => {
    try {
      const res = await axios.get(`/api/admin/categories/get`);

      setCategories(res.data.data);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    setCategories,
    getCategories,
    isLoadingContent,
    setIsLoadingContent,
  };
};
