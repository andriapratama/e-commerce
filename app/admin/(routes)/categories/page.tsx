"use client";

import Title from "@/components/admin/Title";
import CategoryEdit from "@/components/admin/category/CategoryEdit";
import CategoryInput from "@/components/admin/category/CategoryInput";
import CategoryTable from "@/components/admin/category/CategoryTable";
import React, { useState } from "react";
import { CategoryType } from "@/types/CategoryType";
import { ToastContainer } from "react-toastify";
import { useShowCategoriesHook } from "@/hooks/admin/CategoryHook";

const Categories = () => {
  const { categories, showCategories } = useShowCategoriesHook();
  const [editCategory, setEditCategory] = useState<CategoryType>({
    name: "",
    slug: "",
  });

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />
        <Title title="Kategori" />
        <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
          {editCategory.name ? (
            <CategoryEdit
              editCategory={editCategory}
              setEditCategory={setEditCategory}
              showCategories={showCategories}
            />
          ) : (
            <CategoryInput showCategories={showCategories} />
          )}
          <CategoryTable
            categories={categories}
            setEditCategory={setEditCategory}
          />
        </div>
      </div>
    </section>
  );
};

export default Categories;
