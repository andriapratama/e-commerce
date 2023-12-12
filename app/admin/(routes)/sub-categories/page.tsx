"use client";

import React, { useState } from "react";
import Title from "@/components/admin/Title";
import { ToastContainer } from "react-toastify";
import { SubCategoryType } from "@/types/CategoryType";
import ContentLoading from "@/components/ContentLoading";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { useGetSubCategoryHook } from "@/hooks/admin/GetSubCategoryHook";
import SubCategoryAdd from "@/components/admin/sub-category/SubCategoryAdd";
import SubCategoryEdit from "@/components/admin/sub-category/SubCategoryEdit";
import SubCategoryTable from "@/components/admin/sub-category/SubCategoryTable";

const SubCategories = () => {
  const [editData, setEditData] = useState<SubCategoryType>({
    name: "",
    slug: "",
    category: {
      name: "",
      slug: "",
    },
  });

  const { subCategories, getSubCategories, isLoadingContent } =
    useGetSubCategoryHook();

  const { categories } = useGetCategoriesHook();

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
                getSubCategories={getSubCategories}
                categories={categories}
              />
            ) : (
              <SubCategoryAdd getSubCategories={getSubCategories} />
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
};

export default SubCategories;
