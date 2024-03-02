"use client";

import React, { useEffect, useState } from "react";
import Title from "@/components/admin/Title";
import PageLoading from "@/components/PageLoading";
import ProductAddForm from "@/components/admin/product-add/ProductAddForm";
import { useLoadingPageContext } from "@/context/LoadingPageContext";

const ProductAdd = () => {
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
          <Title title="Tambah Produk" />

          <ProductAddForm setIsLoadingPage={setIsLoadingPage} />
        </div>
      </section>
    );
  }
};

export default ProductAdd;
