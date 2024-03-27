"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { CategoryType } from "@/types/CategoryType";

const CategoryEdit = dynamic(
  () => import("@/components/admin/category/CategoryEdit")
);
const CategoryInput = dynamic(
  () => import("@/components/admin/category/CategoryInput")
);
const CategoryTable = dynamic(
  () => import("@/components/admin/category/CategoryTable")
);
const Title = dynamic(() => import("@/components/admin/Title"));

const Categories = () => {
  const [editCategory, setEditCategory] = useState<CategoryType>({
    name: "",
    slug: "",
  });

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const { categories, isLoadingContent } = useGetCategoriesHook();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />
          <Title title="Kategori" />
          <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
            {editCategory.name ? (
              <CategoryEdit
                setEditCategory={setEditCategory}
                editCategory={editCategory}
              />
            ) : (
              <CategoryInput />
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
  }
};

export default Categories;
