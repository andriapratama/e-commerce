import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import {
  useGetOnePromoHook,
  useGetPromoStockHook,
} from "@/hooks/client/PromoHook";
import { authOptions } from "@/lib/auth";
import { PromoType } from "@/types/PromoType";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const PromoDetailContent = dynamic(
  () => import("@/components/client/promo-detail/PromoDetailContent")
);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const slug: string = params.id;

  let thisPromo: PromoType = {
    createdAt: new Date(),
    description: "",
    firstPrice: 0,
    image: "",
    imagePathname: "",
    name: "",
    promoPrice: 0,
    slug: "",
    status: "archive",
  };

  try {
    const { promo } = await useGetOnePromoHook(slug);

    thisPromo = promo;
  } catch (error: any) {}

  const desc = thisPromo.description;

  const title = `${thisPromo.name} | Bottle Time`;

  return {
    title: title,
    description: desc ? desc : "",
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/promos/${thisPromo.slug}`,
      title: title,
      description: desc ? desc : "",
      siteName: "Bottle Time",
      images: [thisPromo.image],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const PromoDetail = async ({ params }: { params: { id: string } }) => {
  const slug: string = params.id;

  let thisPromo: PromoType = {
    createdAt: new Date(),
    description: "",
    firstPrice: 0,
    image: "",
    imagePathname: "",
    name: "",
    promoPrice: 0,
    slug: "",
    status: "archive",
  };

  let isPromo404: boolean = false;

  try {
    const { promo } = await useGetOnePromoHook(slug);

    thisPromo = promo;
  } catch (error: any) {
    if (error.response.status === 404) {
      isPromo404 = true;
    }
  }

  let thisTotalStock: number = 0;

  try {
    const { totalStock } = await useGetPromoStockHook(slug);

    thisTotalStock = totalStock;
  } catch (error) {
    thisTotalStock = 0;
  }

  const session = await getServerSession(authOptions);

  let thisCountCarts: number = 0;

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
    <section className="w-full">
      {session?.user.role === "member" ? (
        <Navbar role={session?.user.role} countCarts={thisCountCarts} />
      ) : (
        <Navbar />
      )}

      {isPromo404 ? (
        <div className="w-full md:min-h-[calc(100vh-386px)] min-h-[calc(100vh-52px)] flex justify-center items-center">
          Opss, promo not found.
        </div>
      ) : (
        <PromoDetailContent promo={thisPromo} totalStock={thisTotalStock} />
      )}
      <Footer />
    </section>
  );
};

export default PromoDetail;
