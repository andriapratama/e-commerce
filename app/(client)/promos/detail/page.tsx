import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { keywords } from "@/constant/Keywords";
import {
  useGetOnePromoHook,
  useGetPromoStockHook,
} from "@/hooks/client/PromoHook";
import { PromoType } from "@/types/PromoType";

const PromoDetailContent = dynamic(
  () => import("@/components/client/promo-detail/PromoDetailContent")
);

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { promo: string };
}): Promise<Metadata> {
  if (!searchParams.promo) {
    return {
      title: "Bottle Time",
      description: "Promo not found",
      metadataBase: new URL(`${process.env.WEB_URL}`),
      openGraph: {
        type: "website",
        url: `${process.env.WEB_URL}/promos/detail`,
        title: "Bottle Time",
        description: "Promo not found",
        siteName: "Bottle Time",
        images: `/logo.png`,
      },
      keywords: ["bottle time", "bottle times", ...keywords],
    };
  } else {
    const slug: string = searchParams.promo;

    let thisPromo: PromoType | undefined = undefined;

    try {
      const { promo } = await useGetOnePromoHook(slug);

      thisPromo = promo;
    } catch (error: any) {}

    const desc = thisPromo?.description;

    const title = `${thisPromo?.name} | Bottle Time`;

    return {
      title: title,
      description: desc ? desc : "",
      openGraph: {
        type: "website",
        url: `${process.env.WEB_URL}/promos/detail?promo=${thisPromo?.slug}`,
        title: title,
        description: desc ? desc : "",
        siteName: "Bottle Time",
        images: [thisPromo?.image as string],
      },
      keywords: ["bottle time", "bottle times", ...keywords],
    };
  }
}

const PromoDetail = async ({
  searchParams,
}: {
  searchParams: { promo: string };
}) => {
  if (!searchParams.promo) {
    return (
      <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-480px)] min-h-[calc(100vh-130px)] flex justify-center items-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
        Opss, promo not found.
      </div>
    );
  } else {
    const slug: string = searchParams.promo;

    let thisPromo: PromoType | undefined = undefined;

    let thisTotalStock: number = 0;

    try {
      const { promo } = await useGetOnePromoHook(slug);

      thisPromo = promo;

      const { totalStock } = await useGetPromoStockHook(slug);

      thisTotalStock = totalStock;
    } catch (error: any) {}

    if (!thisPromo) {
      return (
        <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-480px)] min-h-[calc(100vh-130px)] flex justify-center items-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
          Opss, promo not found.
        </div>
      );
    } else {
      return (
        <PromoDetailContent promo={thisPromo} totalStock={thisTotalStock} />
      );
    }
  }
};

export default PromoDetail;
