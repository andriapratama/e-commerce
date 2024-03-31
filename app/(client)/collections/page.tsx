import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllProductsHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import { ClientProductType } from "@/types/ProductType";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
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
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/collections`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: ["/logo.png"],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Collections = async ({ searchParams }: any) => {
  const categoryParams: string = searchParams.category;

  const subCategoryParams: string = searchParams.subCategory;

  const statusParams: string = searchParams.status;

  const pageParams: string = searchParams.page;

  let thisCountCarts: number = 0;

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

    console.log(products);
  } catch (error) {}

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
    <section className="w-full">
      {session?.user.role === "member" ? (
        <Navbar countCarts={thisCountCarts} role={session?.user.role} />
      ) : (
        <Navbar />
      )}
      <CollectionContent products={thisProducts} totalPage={thisTotalPage} />
      <Footer />
    </section>
  );
};

export default Collections;
