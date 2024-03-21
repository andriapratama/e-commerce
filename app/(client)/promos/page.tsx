import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { authOptions } from "@/lib/auth";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const PromoContent = dynamic(
  () => import("@/components/client/promo/PromoContent")
);

export async function generateMetadata(): Promise<Metadata> {
  let logo: string = "";

  try {
    const res = await axios.get(`${process.env.WEB_URL}/api/setting/logo/get`);

    logo = res.data.data.image;
  } catch (error) {}

  const desc =
    "Unlock exclusive offers! Explore our latest promotions for unbeatable deals. Shop now and save big.";

  const title = "Promos | Bottle Time";

  return {
    title: title,
    description: desc,
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/promos`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [logo],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Promos = async () => {
  let thisCountCarts: number = 0;

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
        <Navbar countCarts={thisCountCarts} role={session?.user.role} />
      ) : (
        <Navbar />
      )}
      <PromoContent />
      <Footer />
    </section>
  );
};

export default Promos;
