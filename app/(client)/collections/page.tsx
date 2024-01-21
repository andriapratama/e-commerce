import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import CollectionContent from "@/components/client/collection/CollectionContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllProductsHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Collections = async ({ searchParams }: any) => {
  const categoryParams: string = searchParams.category;

  const subCategoryParams: string = searchParams.subCategory;

  const statusParams: string = searchParams.status;

  const pageParams: string = searchParams.page;

  let thisCountCarts: number = 0;

  const { products, totalPage } = await useGetAllProductsHook(
    categoryParams,
    subCategoryParams,
    statusParams,
    pageParams
  );

  const { categories } = await useGetAllCategoriesHook();

  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    try {
      const { countCarts } = await useCountCartsHook();

      thisCountCarts = countCarts;
    } catch (error: any) {
      if (error.response.status === 404) {
        redirect("/denied");
      }
    }
  }

  return (
    <section className="w-full">
      {session?.user.role === "member" ? (
        <Navbar
          countCarts={thisCountCarts}
          categories={categories}
          role={session?.user.role}
        />
      ) : (
        <Navbar categories={categories} />
      )}
      <CollectionContent
        categories={categories}
        products={products}
        totalPage={totalPage}
      />
      <Footer />
    </section>
  );
};

export default Collections;
