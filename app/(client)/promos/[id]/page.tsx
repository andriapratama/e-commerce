import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import {
  useGetOnePromoHook,
  useGetPromoStockHook,
} from "@/hooks/client/PromoHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import PromoDetailContent from "@/components/client/promo-detail/PromoDetailContent";
import React from "react";

const PromoDetail = async ({ params }: { params: { id: string } }) => {
  const slug: string = params.id;

  try {
    const session = await getServerSession(authOptions);

    const { countCarts } = await useCountCartsHook();

    const { categories } = await useGetAllCategoriesHook();

    const { promo } = await useGetOnePromoHook(slug);

    const { totalStock } = await useGetPromoStockHook(slug);

    return (
      <section className="w-full">
        <Navbar
          role={session?.user.role}
          categories={categories}
          countCarts={countCarts}
        />
        <PromoDetailContent promo={promo} totalStock={totalStock} />
        <Footer />
      </section>
    );
  } catch (error) {
    const { categories } = await useGetAllCategoriesHook();

    const { promo } = await useGetOnePromoHook(slug);

    const { totalStock } = await useGetPromoStockHook(slug);

    return (
      <section className="w-full">
        <Navbar categories={categories} />
        <PromoDetailContent promo={promo} totalStock={totalStock} />
        <Footer />
      </section>
    );
  }
};

export default PromoDetail;
