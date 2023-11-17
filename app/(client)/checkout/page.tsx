import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import CheckoutContent from "@/components/client/checkout/CheckoutContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllDataCheckoutByEmail } from "@/hooks/client/CheckoutHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Checkout = async () => {
  let isEmptyData: boolean = false;

  try {
    const session = await getServerSession(authOptions);

    const { user } = await useGetUserByEmailHook();

    const { countCarts } = await useCountCartsHook();

    const { carts } = await useGetAllDataCheckoutByEmail();

    carts.length <= 0 ? (isEmptyData = true) : (isEmptyData = false);

    return (
      <section className="w-full min-h-screen">
        <Topbar role={session?.user.role} userName={user.firstName} />
        <Navbar countCarts={countCarts} />
        <TitlePage title="Checkout" />
        <CheckoutContent carts={carts} />
        <Footer />
      </section>
    );
  } catch (error) {
    return (
      <section className="w-full min-h-screen">
        <Topbar />
        <Navbar />
        <TitlePage title="Checkout" />
        <CheckoutContent />
        <Footer />
      </section>
    );
  } finally {
    isEmptyData === true && redirect("/cart");
  }
};

export default Checkout;
