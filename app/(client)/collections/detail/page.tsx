import { Metadata } from "next";
import { default as lazyLoading } from "next/dynamic";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useGetProductDetailHook } from "@/hooks/client/ProductHook";

const CollectionDetailContent = lazyLoading(
  () => import("@/components/client/collection-detail/CollectionDetailContent")
);

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { product: string };
}): Promise<Metadata> {
  if (!searchParams.product) {
    return {
      title: "Bottle Time",
      description: "Product not found",
      metadataBase: new URL(`${process.env.WEB_URL}`),
      openGraph: {
        type: "website",
        url: `${process.env.WEB_URL}/collections/detail`,
        title: "Bottle Time",
        description: "Product not found",
        siteName: "Bottle Time",
        images: `/logo.png`,
      },
      keywords: ["bottle time", "bottle times", ...keywords],
    };
  } else {
    const slug: string = searchParams.product;

    const product = await useGetProductDetailHook(slug);

    const desc = product?.description;

    const title = `${product?.name} | Bottle Time`;

    return {
      title: title,
      description: desc ? desc : "",
      openGraph: {
        type: "website",
        url: `${process.env.WEB_URL}/collections/detail?product=${product?.slug}`,
        title: title,
        description: desc ? desc : "",
        siteName: "Bottle Time",
        images: [product?.image as string],
      },
      keywords: ["bottle time", "bottle times", ...keywords],
    };
  }
}

const CollectionDetail = async ({
  searchParams,
}: {
  searchParams: { product: string };
}) => {
  if (!searchParams.product) {
    return (
      <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-480px)] min-h-[calc(100vh-130px)] flex justify-center items-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
        Opss, product not found.
      </div>
    );
  } else {
    const slug = searchParams.product;

    const product = await useGetProductDetailHook(slug);

    if (!product) {
      return (
        <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-480px)] min-h-[calc(100vh-130px)] flex justify-center items-center lg:mt-[150px] md:mt-[100px] mt-[80px]">
          Opss, product not found.
        </div>
      );
    } else {
      return <CollectionDetailContent product={product} slug={slug} />;
    }
  }
};

export default CollectionDetail;
