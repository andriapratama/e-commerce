import { CategoriesDataType } from "@/types/admin/Categories";
import axios from "axios";
import { useEffect, useState } from "react";

export const useShowCategoriesHook = () => {
  const [categories, setCategories] = useState<CategoriesDataType[]>([]);

  const showCategories = async () => {
    try {
      const res = await axios.get("/api/admin/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showCategories();
  }, []);

  return {
    categories,
    setCategories,
    showCategories,
  };
};
