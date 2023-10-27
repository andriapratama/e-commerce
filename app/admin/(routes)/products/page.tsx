import Title from "@/components/admin/Title";
import ProductTable from "@/components/admin/product/ProductTable";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const Product = async () => {
  try {
    const res = await axios.get(`${process.env.WEB_URL}/api/admin/products`);

    const products = res.data.data;
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <Title
            title="Produk"
            nameBtn="Tambah Produk"
            link="/admin/products/add"
          />
          <ProductTable products={products} />
        </div>
      </section>
    );
  } catch (error: any) {
    return toast.error(error.response.data.message);
  }
};

export default Product;
