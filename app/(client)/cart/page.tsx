import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import {
  useCountCartsHook,
  useGetAllCartsByEmail,
} from "@/hooks/client/CartHook";
import { authOptions } from "@/lib/auth";
import { CartType } from "@/types/CartType";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const CartLocalTable = dynamic(
  () => import("@/components/client/cart-local/CartLocalTable")
);
const CartTable = dynamic(() => import("@/components/client/cart/CartTable"));

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Your cart: where great tastes meet convenience. Shop now for a delightful experience.";

  const title = "Cart | Bottle Time";

  return {
    title: title,
    description: desc,
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/cart`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: ["/logo.png"],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Cart = async () => {
  const session = await getServerSession(authOptions);

  let thisCountCarts: number = 0;

  let thisCarts: CartType[] = [];

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

    let carts404: boolean = false;

    try {
      const { carts } = await useGetAllCartsByEmail();

      thisCarts = carts;
    } catch (error: any) {
      if (error.response.status === 404) carts404 = true;
    } finally {
      if (carts404) redirect("/denied");
    }
  }

  return (
    <section className="w-full">
      {session?.user.role === "member" ? (
        <React.Fragment>
          <Navbar countCarts={thisCountCarts} role={session?.user.role} />

          <CartTable carts={thisCarts} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Navbar />

          <CartLocalTable />
        </React.Fragment>
      )}

      <Footer />
    </section>
  );
};

export default Cart;
