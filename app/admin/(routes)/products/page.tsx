import Title from "@/components/admin/Title";
import ProductTable from "@/components/admin/product/ProductTable";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import React from "react";

const Product = async () => {
  try {
    const session = await getServerSession(authOptions);

    const username = session?.user.username;

    const res = await axios.get(
      `${process.env.WEB_URL}/api/${username}/products/get`
    );

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
    return console.log(error.response.data.message);
  }
};

export default Product;
