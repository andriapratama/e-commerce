import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import CheckoutContent from "@/components/client/checkout/CheckoutContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Checkout = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <section className="w-full min-h-screen">
        <Topbar role={undefined} />
        <Navbar />
        <TitlePage title="Checkout" />
        <CheckoutContent />
        <Footer />
      </section>
    );
  }

  const { countCarts } = await useCountCartsHook();

  const resCarts = await axios.get(
    `${process.env.WEB_URL}/api/checkout/${session?.user.email}`
  );

  const carts = resCarts.data.data;

  if (carts.length <= 0) {
    return redirect("/cart");
  }

  return (
    <section className="w-full min-h-screen">
      <Topbar role={session?.user.role} />
      <Navbar countCarts={countCarts} />
      <TitlePage title="Checkout" />
      <CheckoutContent carts={carts} />
      <Footer />
    </section>
  );
};

export default Checkout;
