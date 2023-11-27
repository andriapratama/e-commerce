"use client";

import ContentLoading from "@/components/ContentLoading";
import Title from "@/components/admin/Title";
import CategoryEdit from "@/components/admin/category/CategoryEdit";
import CategoryInput from "@/components/admin/category/CategoryInput";
import CategoryTable from "@/components/admin/category/CategoryTable";
import { CategoryType } from "@/types/CategoryType";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [editCategory, setEditCategory] = useState<CategoryType>({
    name: "",
    slug: "",
  });

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const getCategories = async () => {
    try {
      const res = await axios.get(`/api/admin/categories/get`);

      setCategories(res.data.data);

      setIsLoadingPage(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />
        <Title title="Kategori" />
        <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
          {editCategory.name ? (
            <CategoryEdit
              getCategories={getCategories}
              editCategory={editCategory}
              setEditCategory={setEditCategory}
            />
          ) : (
            <CategoryInput getCategories={getCategories} />
          )}
          {isLoadingPage ? (
            <ContentLoading />
          ) : (
            <CategoryTable
              categories={categories}
              setEditCategory={setEditCategory}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
