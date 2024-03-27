"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { useGetSubCategoryHook } from "@/hooks/admin/GetSubCategoryHook";
import { AdminProductType } from "@/types/ProductType";

const Title = dynamic(() => import("@/components/admin/Title"));
const ProductTable = dynamic(
  () => import("@/components/admin/product/ProductTable")
);
const ProductSearch = dynamic(
  () => import("@/components/admin/product/ProductSearch")
);
const ProductSelect = dynamic(
  () => import("@/components/admin/product/ProductSelect")
);

const Product = () => {
  const [products, setProducts] = useState<AdminProductType[]>([]);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const [totalPage, setTotalPage] = useState<number>(0);

  const searchParams = useSearchParams();

  const categoryParams = searchParams.get("category");

  const subCategoryParams = searchParams.get("subCategory");

  const pageParams = searchParams.get("page");

  const searchValueParams = searchParams.get("search");

  const pageNow = parseInt(pageParams ? pageParams : "1");

  const router = useRouter();

  const getProducts = useCallback(async () => {
    try {
      const pathName = "/api/admin/products/get";

      let route = "";

      if (categoryParams && subCategoryParams) {
        route = `${pathName}?category=${categoryParams}&subCategory=${subCategoryParams}&page=${pageNow}`;
      } else if (categoryParams) {
        route = `${pathName}?category=${categoryParams}&page=${pageNow}`;
      } else if (searchValueParams) {
        route = `${pathName}?search=${searchValueParams}`;
      } else {
        route = `${pathName}?page=${pageNow}`;
      }

      const res = await axios.get(route);

      setProducts(res.data.data.products);

      setTotalPage(res.data.data.totalPage);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);

      setIsLoadingContent(false);
    }
  }, [pageNow, searchValueParams, categoryParams, subCategoryParams]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleAddProduct = () => {
    setIsLoadingPage(true);
    router.push("/admin/products/add");
  };

  const { categories, category, setCategory } = useGetCategoriesHook();

  const { subCategories, subCategory, setSubCategory } = useGetSubCategoryHook(
    categoryParams ? categoryParams : "none"
  );

  useEffect(() => {
    if (categoryParams) {
      setCategory(categoryParams);
    } else {
      setCategory("");
    }

    if (subCategoryParams) {
      setSubCategory(subCategoryParams);
    } else {
      setSubCategory("");
    }
  }, [categoryParams, subCategoryParams]);

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <Title
            title="Produk"
            nameBtn="Tambah Produk"
            handleClick={handleAddProduct}
          />
          <div className="flex items-center py-4 gap-3">
            <ProductSearch />

            <ProductSelect
              status="category"
              categories={categories}
              category={category}
              setCategory={setCategory}
            />

            {subCategories.length > 0 && (
              <ProductSelect
                status="subCategory"
                categories={subCategories}
                category={subCategory}
                setCategory={setSubCategory}
              />
            )}
          </div>

          {isLoadingContent ? (
            <ContentLoading className="mt-10" />
          ) : (
            <ProductTable
              products={products}
              setIsLoadingPage={setIsLoadingPage}
              setIsLoadingContent={setIsLoadingContent}
              totalPage={totalPage}
            />
          )}
        </div>
      </section>
    );
  }
};

export default Product;
