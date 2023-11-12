import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import Categories from "@/components/client/collection/Categories";
import Products from "@/components/client/collection/Products";
import SearchByCategory from "@/components/client/collection/SearchByCategory";
import SearchByName from "@/components/client/collection/SearchByName";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllProductsHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Collections = async () => {
  try {
    const session = await getServerSession(authOptions);

    const { categories } = await useGetAllCategoriesHook();

    const { products } = await useGetAllProductsHook();

    const { countCarts } = await useCountCartsHook();

    return (
      <section className="w-full min-h-screen">
        <Topbar role={session?.user.role} />
        <Navbar countCarts={countCarts} />
        <TitlePage title="Our Collections" />

        <div className="w-full flex justify-center mt-5">
          <div className="w-[90%] flex gap-5 mt-[100px]">
            <div className="w-full">
              <SearchByName />

              <SearchByCategory categories={categories} />

              <Products products={products} />
            </div>
            <Categories categories={categories} />
          </div>
        </div>
        <Footer />
      </section>
    );
  } catch (error) {
    const { categories } = await useGetAllCategoriesHook();

    const { products } = await useGetAllProductsHook();

    return (
      <section className="w-full min-h-screen">
        <Topbar role={undefined} />
        <Navbar />
        <TitlePage title="Our Collections" />

        <div className="w-full flex justify-center mt-5">
          <div className="w-[90%] flex gap-5 mt-[100px]">
            <div className="w-full">
              <SearchByName />

              <SearchByCategory categories={categories} />

              <Products products={products} />
            </div>
            <Categories categories={categories} />
          </div>
        </div>
        <Footer />
      </section>
    );
  }
};

export default Collections;
