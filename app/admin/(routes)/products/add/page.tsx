import Title from "@/components/admin/Title";
import ProductAddForm from "@/components/admin/product/ProductAddForm";
import React from "react";
import { useShowCategoriesHook } from "@/hooks/admin/CategoryHook";
import axios from "axios";

const ProductAdd = async () => {
  const res = await axios.get(`${process.env.WEB_URL}/api/admin/categories`);
  const categories = res.data.data;

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <Title title="Tambah Produk" />

        <ProductAddForm categories={categories} />
      </div>
    </section>
  );
};

export default ProductAdd;
