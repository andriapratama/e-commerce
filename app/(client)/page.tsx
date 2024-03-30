import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";
import { ToastContainer } from "react-toastify";

import { keywords } from "@/constant/Keywords";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllHerosData } from "@/hooks/client/HeroHook";
import { useGetSpecialProductsHook } from "@/hooks/client/useGetSpecialProductsHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { HeroClientType } from "@/types/HeroType";
import { ClientProductType } from "@/types/ProductType";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const Hero = dynamic(() => import("@/components/client/home/Hero"));
const Products = dynamic(() => import("@/components/client/home/Products"));
const Promo = dynamic(() => import("@/components/client/home/Promo"));

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Treat yourself to top-tier beverages! Explore premium beer, spirits, and wine at Bottle Time. Fast delivery available.";

  const title = "Home | Bottle Time";

  return {
    title: title,
    description: desc,
    openGraph: {
      type: "website",
      url: process.env.WEB_URL,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: ["/logo.png"],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Home = async () => {
  const session = await getServerSession(authOptions);

  let thisCountCarts: number = 0;

  if (session?.user.role === "member") {
    let isUserActive: boolean = false;

    let user404: boolean = false;

    try {
      const { user } = await useGetUserByEmailHook();

      isUserActive = user.active;
    } catch (error: any) {
      if (error.response.status === 404) user404 = true;
    } finally {
      if (isUserActive === false) redirect("/announcement");
      if (user404) redirect("/denied");
    }

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

  let thisHeros: HeroClientType[] = [];
  let bestProducts: ClientProductType[] = [];
  let newProducts: ClientProductType[] = [];
  let saleProducts: ClientProductType[] = [];

  try {
    const { heros } = await useGetAllHerosData();

    const { products: bestProduct } = await useGetSpecialProductsHook("best");

    const { products: newProduct } = await useGetSpecialProductsHook("new");

    const { products } = await useGetSpecialProductsHook("sale");

    thisHeros = heros;
    bestProducts = bestProduct;
    newProducts = newProduct;
    saleProducts = products;
  } catch (error) {}

  return (
    <React.Fragment>
      <ToastContainer />

      <main className="min-h-screen !w-full overflow-x-hidden">
        {session?.user.role === "member" ? (
          <Navbar countCarts={thisCountCarts} role={session?.user.role} />
        ) : (
          <Navbar />
        )}
        <Hero heros={thisHeros} />
        <Products title="best seller" products={bestProducts} />
        <Products title="new" products={newProducts} />
        <Products title="sale" products={saleProducts} />
        <Promo />
        <Footer />
      </main>
    </React.Fragment>
  );
};

export default Home;
