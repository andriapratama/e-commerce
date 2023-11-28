"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { AdminProductType } from "@/types/ProductType";
import Title from "@/components/admin/Title";
import ProductTable from "@/components/admin/product/ProductTable";
import PageLoading from "@/components/PageLoading";
import ContentLoading from "@/components/ContentLoading";

const Product = () => {
  const [products, setProducts] = useState<AdminProductType[]>([]);

  const [search, setSearch] = useState<string>("");

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const router = useRouter();

  const getProducts = async () => {
    try {
      const res = await axios.get(`/api/admin/products/get`);

      setProducts(res.data.data);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);

      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleAddProduct = () => {
    setIsLoadingPage(true);
    router.push("/admin/products/add");
  };

  if (isLoadingPage) {
    <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <Title
            title="Produk"
            nameBtn="Tambah Produk"
            handleClick={handleAddProduct}
          />
          <div className="flex items-center py-4">
            <Input
              placeholder="Cari nama produk"
              value={search}
              className="max-w-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoadingContent ? (
            <ContentLoading className="mt-10" />
          ) : (
            <ProductTable
              products={products}
              setIsLoadingPage={setIsLoadingPage}
            />
          )}
        </div>
      </section>
    );
  }
};

export default Product;
