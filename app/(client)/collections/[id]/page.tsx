import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import Product from "@/components/client/collection-detail/Product";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import React from "react";

const CollectionDetail = async ({ params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    const productRes = await axios.get(
      `${process.env.WEB_URL}/api/products/${params.id}`
    );

    const product = productRes.data.data;
    return (
      <section className="w-full">
        <Topbar role={session?.user.role} />
        <Navbar />
        <TitlePage title="Collection Detail" />

        <Product product={product} />
        <Footer />
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default CollectionDetail;
