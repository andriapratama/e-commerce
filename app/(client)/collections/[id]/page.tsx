import TitlePage from "@/components/client/TitlePage";
import Product from "@/components/client/collection-detail/Product";
import axios from "axios";
import React from "react";

const CollectionDetail = async ({ params }: { params: { id: string } }) => {
  try {
    const productRes = await axios.get(
      `${process.env.WEB_URL}/api/products/${params.id}`
    );

    const product = productRes.data.data;
    return (
      <section className="w-full">
        <TitlePage title="Collection Detail" />

        <Product product={product} />
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default CollectionDetail;
