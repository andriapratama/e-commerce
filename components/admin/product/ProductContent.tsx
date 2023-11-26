"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "../Title";
import ProductTable from "./ProductTable";
import PageLoading from "@/components/PageLoading";
import { Input } from "@/components/ui/input";
import { AdminProductType } from "@/types/ProductType";

interface ProductContentProps {
  products: AdminProductType[];
}

const ProductContent: React.FC<ProductContentProps> = ({ products }) => {
  const [search, setSearch] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleClick = () => {
    setIsLoading(true);
    router.push("/admin/products/add");
  };

  if (isLoading) {
    return <PageLoading />;
  } else {
    return (
      <React.Fragment>
        <Title
          title="Produk"
          nameBtn="Tambah Produk"
          handleClick={handleClick}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Cari nama produk"
            value={search}
            className="max-w-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ProductTable products={products} setIsLoading={setIsLoading} />
      </React.Fragment>
    );
  }
};

export default ProductContent;
