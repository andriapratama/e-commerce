"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr";

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
  const [route, setRoute] = useState<string>("");

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const searchParams = useSearchParams();

  const categoryParams = searchParams.get("category");

  const subCategoryParams = searchParams.get("subCategory");

  const pageParams = searchParams.get("page");

  const searchValueParams = searchParams.get("search");

  const pageNow = parseInt(pageParams ? pageParams : "1");

  const router = useRouter();

  const fetcher: Fetcher<{
    data: { products: AdminProductType[]; totalPage: number } | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(route, fetcher);

  useEffect(() => {
    const api = "/api/admin/products/get";

    if (categoryParams && subCategoryParams) {
      setRoute(
        `${api}?category=${categoryParams}&subCategory=${subCategoryParams}&page=${pageNow}`
      );
    } else if (categoryParams) {
      setRoute(`${api}?category=${categoryParams}&page=${pageNow}`);
    } else if (searchValueParams) {
      setRoute(`${api}?search=${searchValueParams}`);
    } else {
      setRoute(`${api}?page=${pageNow}`);
    }
  }, [pageNow, searchValueParams, categoryParams, subCategoryParams]);

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

            {subCategories && subCategories.length > 0 ? (
              <ProductSelect
                status="subCategory"
                categories={subCategories}
                category={subCategory}
                setCategory={setSubCategory}
              />
            ) : null}
          </div>

          {isLoading ? (
            <ContentLoading className="mt-10" />
          ) : (
            <ProductTable
              products={data?.data?.products}
              setIsLoadingPage={setIsLoadingPage}
              totalPage={data?.data?.totalPage}
            />
          )}
        </div>
      </section>
    );
  }
};

export default Product;
