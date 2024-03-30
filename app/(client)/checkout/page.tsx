import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllDataCheckoutByEmail } from "@/hooks/client/CheckoutHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { CartType } from "@/types/CartType";
import { UserType } from "@/types/UserType";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const CheckoutLocalContent = dynamic(
  () => import("@/components/client/checkout-local/CheckoutLocalContent")
);
const CheckoutContent = dynamic(
  () => import("@/components/client/checkout/CheckoutContent")
);

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Efficient, user-friendly checkout page for smooth transactions. Simplify the process, enhance user experience, and drive conversions!";

  const title = "Checkout | Bottle Time";

  return {
    title: title,
    description: desc,
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/checkout`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: ["/logo.png"],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Checkout = async () => {
  const session = await getServerSession(authOptions);

  let thisCountCarts: number = 0;

  let thisCarts: CartType[] = [];

  let thisUser: UserType = {
    firstName: "",
    lastName: "",
    email: "",
    role: "guest",
    address: null,
    phone: null,
    active: false,
  };

  if (session?.user.role === "member") {
    let user404: boolean = false;

    try {
      const { user } = await useGetUserByEmailHook();

      thisUser = user;
    } catch (error: any) {
      if (error.response.status === 404) user404 = true;
    } finally {
      if (user404) redirect("/denied");
    }

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
      const { carts } = await useGetAllDataCheckoutByEmail();

      thisCarts = carts;
    } catch (error: any) {
      if (error.response.status === 404) carts404 = true;
    } finally {
      if (thisCarts.length < 1) redirect("/cart");

      if (carts404) redirect("/denied");
    }
  }

  return (
    <section className="w-full">
      {session?.user.role === "member" ? (
        <>
          <Navbar countCarts={thisCountCarts} role={session?.user.role} />

          <CheckoutContent carts={thisCarts} user={thisUser} />
        </>
      ) : (
        <>
          <Navbar />

          <CheckoutLocalContent />
        </>
      )}
      <Footer />
    </section>
  );
};

export default Checkout;
