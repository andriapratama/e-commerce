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
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/checkout`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Checkout = async () => {
  const session = await getServerSession(authOptions);

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
    <React.Fragment>
      {session?.user.role === "member" ? (
        <CheckoutContent carts={thisCarts} user={thisUser} />
      ) : (
        <CheckoutLocalContent />
      )}
    </React.Fragment>
  );
};

export default Checkout;
