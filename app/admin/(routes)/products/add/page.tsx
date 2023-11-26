import React from "react";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProductAddContent from "@/components/admin/product-add/ProductAddContent";

const ProductAdd = async () => {
  try {
    const session = await getServerSession(authOptions);

    const username = session?.user.username;

    const res = await axios.get(
      `${process.env.WEB_URL}/api/${username}/categories/get`
    );

    const categories = res.data.data;

    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ProductAddContent username={username} categories={categories} />
        </div>
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default ProductAdd;
