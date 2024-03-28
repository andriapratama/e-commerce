"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { useGetSubCategoryHook } from "@/hooks/admin/GetSubCategoryHook";
import { SubCategoryType } from "@/types/CategoryType";

const Title = dynamic(() => import("@/components/admin/Title"));
const SubCategoryAdd = dynamic(
  () => import("@/components/admin/sub-category/SubCategoryAdd")
);
const SubCategoryEdit = dynamic(
  () => import("@/components/admin/sub-category/SubCategoryEdit")
);
const SubCategoryTable = dynamic(
  () => import("@/components/admin/sub-category/SubCategoryTable")
);

const SubCategories = () => {
  const [editData, setEditData] = useState<SubCategoryType>({
    name: "",
    slug: "",
    category: {
      name: "",
      slug: "",
    },
  });

  const { subCategories, isLoadingContent } = useGetSubCategoryHook();

  const { categories } = useGetCategoriesHook();

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

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
          <Title title="Sub Kategori" />
          <div className="w-full flex justify-center">
            <div className="w-[1000px]">
              {editData.name ? (
                <SubCategoryEdit
                  editData={editData}
                  setEditData={setEditData}
                  categories={categories}
                />
              ) : (
                <SubCategoryAdd />
              )}

              {isLoadingContent ? (
                <ContentLoading className="mt-10" />
              ) : (
                <SubCategoryTable
                  subCategories={subCategories}
                  setEditData={setEditData}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default SubCategories;
