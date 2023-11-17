import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import CollectionContent from "@/components/client/collection/CollectionContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllProductsHook } from "@/hooks/client/ProductHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Collections = async () => {
  try {
    const session = await getServerSession(authOptions);

    const { user } = await useGetUserByEmailHook();

    const { categories } = await useGetAllCategoriesHook();

    const { products } = await useGetAllProductsHook();

    const { countCarts } = await useCountCartsHook();

    return (
      <section className="w-full min-h-screen">
        <Topbar role={session?.user.role} userName={user.firstName} />
        <Navbar countCarts={countCarts} />
        <TitlePage title="Our Collections" />
        <CollectionContent categories={categories} products={products} />
        <Footer />
      </section>
    );
  } catch (error) {
    const { categories } = await useGetAllCategoriesHook();

    const { products } = await useGetAllProductsHook();

    return (
      <section className="w-full min-h-screen">
        <Topbar />
        <Navbar />
        <TitlePage title="Our Collections" />
        <CollectionContent categories={categories} products={products} />
        <Footer />
      </section>
    );
  }
};

export default Collections;
