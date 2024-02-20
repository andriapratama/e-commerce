import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import CheckoutLocalContent from "@/components/client/checkout-local/CheckoutLocalContent";
import CheckoutContent from "@/components/client/checkout/CheckoutContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetAllDataCheckoutByEmail } from "@/hooks/client/CheckoutHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { CartType } from "@/types/CartType";
import { UserType } from "@/types/UserType";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Checkout = async () => {
  const { categories } = await useGetAllCategoriesHook();

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
          <Navbar
            countCarts={thisCountCarts}
            categories={categories}
            role={session?.user.role}
          />

          <CheckoutContent carts={thisCarts} user={thisUser} />
        </>
      ) : (
        <>
          <Navbar categories={categories} />

          <CheckoutLocalContent />
        </>
      )}
      <Footer />
    </section>
  );
};

export default Checkout;
