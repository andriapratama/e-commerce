import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import Product from "@/components/client/collection-detail/Product";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetProductDetailHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const CollectionDetail = async ({ params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    const { product } = await useGetProductDetailHook(params.id);

    const { countCarts } = await useCountCartsHook();

    return (
      <section className="w-full">
        <Topbar role={session?.user.role} />
        <Navbar countCarts={countCarts} />
        <TitlePage title="Collection Detail" />

        <Product product={product} />
        <Footer />
      </section>
    );
  } catch (error) {
    const { product } = await useGetProductDetailHook(params.id);

    return (
      <section className="w-full">
        <Topbar role={undefined} />
        <Navbar />
        <TitlePage title="Collection Detail" />

        <Product product={product} />
        <Footer />
      </section>
    );
  }
};

export default CollectionDetail;
