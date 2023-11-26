"use client";

import React, { useState } from "react";
import Title from "../Title";
import ProductAddForm from "./ProductAddForm";
import { CategoryType } from "@/types/CategoryType";
import PageLoading from "@/components/PageLoading";

interface ProductAddContentProps {
  username: string | undefined;
  categories: CategoryType[];
}

const ProductAddContent: React.FC<ProductAddContentProps> = ({
  username,
  categories,
}) => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <React.Fragment>
        <Title title="Tambah Produk" />

        <ProductAddForm
          categories={categories}
          username={username}
          setIsLoadingPage={setIsLoadingPage}
        />
      </React.Fragment>
    );
  }
};

export default ProductAddContent;
