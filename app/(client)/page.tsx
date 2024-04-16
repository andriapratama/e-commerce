import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";

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
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: process.env.WEB_URL,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Home = async () => {
  const session = await getServerSession(authOptions);

  let isActive: boolean = false;

  if (session?.user.role === "member") {
    try {
      const { user } = await useGetUserByEmailHook();

      isActive = user.active;
    } catch (error) {
    } finally {
      if (isActive === false) {
        redirect("/announcement");
      }
    }
  }

  return (
    <React.Fragment>
      <Hero />
      <Products title="best seller" status="best" />
      <Products title="new" status="new" />
      <Products title="sale" status="sale" />
      <Promo />
    </React.Fragment>
  );
};

export default Home;
