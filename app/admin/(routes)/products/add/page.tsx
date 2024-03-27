"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";

import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";

const Title = dynamic(() => import("@/components/admin/Title"));
const ProductAddForm = dynamic(
  () => import("@/components/admin/product-add/ProductAddForm")
);

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
