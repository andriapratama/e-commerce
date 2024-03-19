import axios from "axios";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetProductDetailHook } from "@/hooks/client/ProductHook";
import { authOptions } from "@/lib/auth";
import { ClientProductType } from "@/types/ProductType";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const CollectionDetailContent = dynamic(
  () => import("@/components/client/collection-detail/CollectionDetailContent")
);

const CollectionDetail = async ({ params }: { params: { id: string } }) => {
  const slug: string = params.id;

  let thisProduct: ClientProductType = {
    name: "",
    slug: "",
    totalStock: 0,
    minimumStock: 0,
    price: 0,
    cost: 0,
    netFill: 0,
    status: "new",
    linkGojek: null,
    description: null,
    salePrice: 0,
    category: { name: "" },
    subCategory: null,
    image: "",
    createdAt: "",
  };

  let thisCountCarts: number = 0;

  const session = await getServerSession(authOptions);

  let isProduct404: boolean = false;

  try {
    const { product } = await useGetProductDetailHook(slug);

    thisProduct = product;
  } catch (error: any) {
    if (error.response.status === 404) {
      isProduct404 = true;
    }
  }

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
      {isProduct404 ? (
        <div className="w-full lg:min-h-[calc(100vh-490px)] md:min-h-[calc(100vh-480px)] min-h-[calc(100vh-60px)] lg:mt-[100px] mt-[60px] flex justify-center items-center">
          Opss, product not found.
        </div>
      ) : (
        <CollectionDetailContent product={thisProduct} slug={slug} />
      )}
      <Footer settingValue={settingValue} />
    </section>
  );
};

export default CollectionDetail;
