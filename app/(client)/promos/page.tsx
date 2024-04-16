import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { keywords } from "@/constant/Keywords";

const PromoContent = dynamic(
  () => import("@/components/client/promo/PromoContent")
);

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Unlock exclusive offers! Explore our latest promotions for unbeatable deals. Shop now and save big.";

  const title = "Promos | Bottle Time";

  return {
    title: title,
    description: desc,
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/promos`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Promos = () => {
  return <PromoContent />;
};

export default Promos;
