import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useGetAllProductsHook } from "@/hooks/client/ProductHook";
import { ClientProductType } from "@/types/ProductType";

const CollectionContent = dynamic(
  () => import("@/components/client/collection/CollectionContent")
);

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Discover premium beverages: wines, beers, spirits. Elevate every occasion with us. Cheers!";

  const title = "Collections | Bottle Time";

  return {
    title: title,
    description: desc,
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/collections`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Collections = async ({ searchParams }: any) => {
  const categoryParams: string = searchParams.category;

  const subCategoryParams: string = searchParams.subCategory;

  const statusParams: string = searchParams.status;

  const pageParams: string = searchParams.page;

  let thisProducts: ClientProductType[] = [];

  let thisTotalPage: number = 0;

  try {
    const { products, totalPage } = await useGetAllProductsHook(
      categoryParams,
      subCategoryParams,
      statusParams,
      pageParams
    );

    thisProducts = products;
    thisTotalPage = totalPage;
  } catch (error) {}

  return (
    <React.Fragment>
      <CollectionContent products={thisProducts} totalPage={thisTotalPage} />
    </React.Fragment>
  );
};

export default Collections;
