import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import CollectionDetailContent from "@/components/client/collection-detail/CollectionDetailContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetProductDetailHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const CollectionDetail = async ({ params }: { params: { id: string } }) => {
  const slug: string = params.id;

  try {
    const session = await getServerSession(authOptions);

    const { product } = await useGetProductDetailHook(slug);

    const { countCarts } = await useCountCartsHook();

    const { categories } = await useGetAllCategoriesHook();

    return (
      <section className="w-full">
        <Navbar
          countCarts={countCarts}
          categories={categories}
          role={session?.user.role}
        />
        <CollectionDetailContent product={product} slug={slug} />
        <Footer />
      </section>
    );
  } catch (error) {
    const { product } = await useGetProductDetailHook(slug);

    const { categories } = await useGetAllCategoriesHook();

    return (
      <section className="w-full">
        <Navbar categories={categories} />
        <CollectionDetailContent product={product} slug={slug} />
        <Footer />
      </section>
    );
  }
};

export default CollectionDetail;
