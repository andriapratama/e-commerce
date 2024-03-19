import axios from "axios";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllProductsHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const CollectionContent = dynamic(
  () => import("@/components/client/collection/CollectionContent")
);

const Collections = async ({ searchParams }: any) => {
  const categoryParams: string = searchParams.category;

  const subCategoryParams: string = searchParams.subCategory;

  const statusParams: string = searchParams.status;

  const pageParams: string = searchParams.page;

  let thisCountCarts: number = 0;

  const { products, totalPage } = await useGetAllProductsHook(
    categoryParams,
    subCategoryParams,
    statusParams,
    pageParams
  );

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

  const setting = await axios.get(`${process.env.WEB_URL}/api/setting/get`);

  const settingValue = setting.data.data;

  return (
    <section className="w-full">
      {session?.user.role === "member" ? (
        <Navbar countCarts={thisCountCarts} role={session?.user.role} />
      ) : (
        <Navbar />
      )}
      <CollectionContent products={products} totalPage={totalPage} />
      <Footer settingValue={settingValue} />
    </section>
  );
};

export default Collections;
