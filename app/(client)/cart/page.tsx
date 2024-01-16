import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import CartTable from "@/components/client/cart/CartTable";
import {
  useCountCartsHook,
  useGetAllCartsByEmail,
} from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Cart = async () => {
  try {
    const session = await getServerSession(authOptions);

    const { carts } = await useGetAllCartsByEmail();

    const { countCarts } = await useCountCartsHook();

    const { categories } = await useGetAllCategoriesHook();

    return (
      <section className="w-full min-h-screen">
        <Navbar
          countCarts={countCarts}
          categories={categories}
          role={session?.user.role}
        />
        <CartTable carts={carts} />
        <Footer />
      </section>
    );
  } catch (error) {
    const { categories } = await useGetAllCategoriesHook();

    return (
      <section className="w-full min-h-screen">
        <Navbar categories={categories} />
        <CartTable />
        <Footer />
      </section>
    );
  }
};

export default Cart;
