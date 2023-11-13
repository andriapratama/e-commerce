import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import CartTable from "@/components/client/cart/CartTable";
import {
  useCountCartsHook,
  useGetAllCartsByEmail,
} from "@/hooks/client/CartHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Cart = async () => {
  try {
    const session = await getServerSession(authOptions);

    const { carts } = await useGetAllCartsByEmail();

    const { countCarts } = await useCountCartsHook();

    return (
      <section className="w-full min-h-screen">
        <Topbar role={session?.user.role} />
        <Navbar countCarts={countCarts} />
        <TitlePage title="My Cart" />
        <CartTable carts={carts} />
        <Footer />
      </section>
    );
  } catch (error) {
    return (
      <section className="w-full min-h-screen">
        <Topbar role={undefined} />
        <Navbar />
        <TitlePage title="My Cart" />
        <CartTable />
        <Footer />
      </section>
    );
  }
};

export default Cart;
