"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { AdminProductType } from "@/types/ProductType";
import Title from "@/components/admin/Title";
import ProductTable from "@/components/admin/product/ProductTable";
import PageLoading from "@/components/PageLoading";
import ContentLoading from "@/components/ContentLoading";
import ProductSearch from "@/components/admin/product/ProductSearch";
import ProductSelect from "@/components/admin/product/ProductSelect";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { useGetSubCategoryHook } from "@/hooks/admin/GetSubCategoryHook";

const Product = () => {
  const [products, setProducts] = useState<AdminProductType[]>([]);

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

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
