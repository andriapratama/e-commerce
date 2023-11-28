"use client";

import React, { useState } from "react";
import Title from "@/components/admin/Title";
import ProductAddForm from "@/components/admin/product-add/ProductAddForm";
import PageLoading from "@/components/PageLoading";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";

const ProductAdd = () => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const { categories } = useGetCategoriesHook();

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <Title title="Tambah Produk" />

          <ProductAddForm
            categories={categories}
            setIsLoadingPage={setIsLoadingPage}
          />
        </div>
      </section>
    );
  }
};

export default ProductAdd;
