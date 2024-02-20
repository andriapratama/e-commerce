import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import CartLocalTable from "@/components/client/cart-local/CartLocalTable";
import CartTable from "@/components/client/cart/CartTable";
import {
  useCountCartsHook,
  useGetAllCartsByEmail,
} from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { authOptions } from "@/lib/auth";
import { CartType } from "@/types/CartType";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Cart = async () => {
  const session = await getServerSession(authOptions);

  const { categories } = await useGetAllCategoriesHook();

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
          <Navbar
            countCarts={thisCountCarts}
            categories={categories}
            role={session?.user.role}
          />

          <CartTable carts={thisCarts} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Navbar categories={categories} />

          <CartLocalTable />
        </React.Fragment>
      )}

      <Footer />
    </section>
  );
};

export default Cart;
