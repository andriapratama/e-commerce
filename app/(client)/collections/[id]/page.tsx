import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import CollectionDetailContent from "@/components/client/collection-detail/CollectionDetailContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetProductDetailHook } from "@/hooks/client/ProductHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const CollectionDetail = async ({ params }: { params: { id: string } }) => {
  const slug: string = params.id;

  try {
    const session = await getServerSession(authOptions);

    const { user } = await useGetUserByEmailHook();

    const { product } = await useGetProductDetailHook(slug);

    const { countCarts } = await useCountCartsHook();

    return (
      <section className="w-full">
        <Topbar role={session?.user.role} userName={user.firstName} />
        <Navbar countCarts={countCarts} />
        <TitlePage title="Collection Detail" />
        <CollectionDetailContent product={product} />
        <Footer />
      </section>
    );
  } catch (error) {
    const { product } = await useGetProductDetailHook(slug);

    return (
      <section className="w-full">
        <Topbar />
        <Navbar />
        <TitlePage title="Collection Detail" />
        <CollectionDetailContent product={product} />
        <Footer />
      </section>
    );
  }
};

export default CollectionDetail;
