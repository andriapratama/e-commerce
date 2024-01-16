import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import CollectionContent from "@/components/client/collection/CollectionContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllProductsHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Collections = async ({ searchParams }: any) => {
  try {
    const session = await getServerSession(authOptions);

    const { categories } = await useGetAllCategoriesHook();

    const { countCarts } = await useCountCartsHook();

    const categoryParams: string = searchParams.category;

    const subCategoryParams: string = searchParams.subCategory;

    const statusParams: string = searchParams.status;

    const pageParams: string = searchParams.page;

    const { products, totalPage } = await useGetAllProductsHook(
      categoryParams,
      subCategoryParams,
      statusParams,
      pageParams
    );

    return (
      <section className="w-full min-h-screen">
        <Navbar
          countCarts={countCarts}
          categories={categories}
          role={session?.user.role}
        />
        <CollectionContent
          categories={categories}
          products={products}
          totalPage={totalPage}
        />
        <Footer />
      </section>
    );
  } catch (error) {
    const { categories } = await useGetAllCategoriesHook();

    const categoryParams: string = searchParams.category;

    const subCategoryParams: string = searchParams.subCategory;

    const statusParams: string = searchParams.status;

    const pageParams: string = searchParams.page;

    const { products, totalPage } = await useGetAllProductsHook(
      categoryParams,
      subCategoryParams,
      statusParams,
      pageParams
    );

    return (
      <section className="w-full min-h-screen">
        <Navbar categories={categories} />
        <CollectionContent
          categories={categories}
          products={products}
          totalPage={totalPage}
        />
        <Footer />
      </section>
    );
  }
};

export default Collections;
