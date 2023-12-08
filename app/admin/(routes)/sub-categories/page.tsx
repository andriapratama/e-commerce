"use client";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Title from "@/components/admin/Title";
import { SubCategoryType } from "@/types/CategoryType";
import ContentLoading from "@/components/ContentLoading";
import React, { useCallback, useEffect, useState } from "react";
import SubCategoryAdd from "@/components/admin/sub-category/SubCategoryAdd";
import SubCategoryTable from "@/components/admin/sub-category/SubCategoryTable";
import SubCategoryEdit from "@/components/admin/sub-category/SubCategoryEdit";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";

const SubCategories = () => {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);

  const [editData, setEditData] = useState<SubCategoryType>({
    name: "",
    slug: "",
    category: {
      name: "",
      slug: "",
    },
  });

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
