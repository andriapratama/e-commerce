"use client";

import Title from "@/components/admin/Title";
import CategoryEdit from "@/components/admin/category/CategoryEdit";
import CategoryInput from "@/components/admin/category/CategoryInput";
import CategoryTable from "@/components/admin/category/CategoryTable";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CategoriesDataType, EditCategoryType } from "@/types/admin/Categories";
import { ToastContainer } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState<CategoriesDataType[]>([]);
  const [editCategory, setEditCategory] = useState<EditCategoryType>({
    id: "",
    name: "",
    slug: "",
  });

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
  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />
        <Title title="Kategori" />
        <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
          {editCategory.id ? (
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
