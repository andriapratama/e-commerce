import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import PromoContent from "@/components/client/promo/PromoContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllPromoHook } from "@/hooks/client/PromoHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Promos = async () => {
  try {
    const session = await getServerSession(authOptions);

    const { categories } = await useGetAllCategoriesHook();

    const { countCarts } = await useCountCartsHook();

    const { promos } = await useGetAllPromoHook();

    return (
      <section className="min-h-screen !w-full overflow-hidden">
        <Navbar
          categories={categories}
          countCarts={countCarts}
          role={session?.user.role}
        />
        <PromoContent promos={promos} />
        <Footer />
      </section>
    );
  } catch (error) {
    const { categories } = await useGetAllCategoriesHook();

    const { promos } = await useGetAllPromoHook();

    return (
      <section className="min-h-screen !w-full overflow-hidden">
        <Navbar categories={categories} />
        <PromoContent promos={promos} />
        <Footer />
      </section>
    );
  }
};

export default Promos;
