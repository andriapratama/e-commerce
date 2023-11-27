"use client";

import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Title from "@/components/admin/Title";
import CategoryEdit from "@/components/admin/category/CategoryEdit";
import CategoryInput from "@/components/admin/category/CategoryInput";
import CategoryTable from "@/components/admin/category/CategoryTable";
import ContentLoading from "@/components/ContentLoading";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { CategoryType } from "@/types/CategoryType";

const Categories = () => {
  const [editCategory, setEditCategory] = useState<CategoryType>({
    name: "",
    slug: "",
  });

  const { categories, getCategories, isLoadingContent } =
    useGetCategoriesHook();

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
          {isLoadingContent ? (
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
