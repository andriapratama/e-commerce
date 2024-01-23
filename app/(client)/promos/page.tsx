import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import PromoContent from "@/components/client/promo/PromoContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllPromoHook } from "@/hooks/client/PromoHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Promos = async () => {
  let thisCountCarts: number = 0;

  const { categories } = await useGetAllCategoriesHook();

  const { promos } = await useGetAllPromoHook();

  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    let isCountCarts404: boolean = false;

    try {
      const { countCarts } = await useCountCartsHook();

      thisCountCarts = countCarts;
    } catch (error: any) {
      if (error.response.status === 404) isCountCarts404 = true;
    } finally {
      if (isCountCarts404) redirect("/denied");
    }
  }

  return (
    <section className="!w-full overflow-hidden">
      {session?.user.role === "member" ? (
        <Navbar
          categories={categories}
          countCarts={thisCountCarts}
          role={session?.user.role}
        />
      ) : (
        <Navbar categories={categories} />
      )}
      <PromoContent promos={promos} />
      <Footer />
    </section>
  );
};

export default Promos;
