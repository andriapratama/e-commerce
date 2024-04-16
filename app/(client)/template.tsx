import { getServerSession } from "next-auth";
import React from "react";
import { ToastContainer } from "react-toastify";

import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import { authOptions } from "@/lib/auth";
import { MenuType } from "@/types/MenuType";

import { getCountCart } from "./_utils/cart";
import { getSetting } from "./_utils/setting";

interface Props {
  children: React.ReactNode;
}

const ClientTemplate: React.FC<Props> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  const menus: MenuType[] = [
    {
      name: "home",
      link: "/",
      status: "active",
    },
    {
      name: "categories",
      link: "/collections",
      status: "active",
    },
    {
      name: "Promo",
      link: "/promos",
      status: "active",
    },
    {
      name: "Register",
      link: "/register",
      status: session?.user.email ? "" : "active",
    },
    {
      name: "Login",
      link: "/login",
      status: session?.user.email ? "" : "active",
    },
    {
      name: "Profile",
      link: "/profile",
      status: session?.user.email ? "active" : "",
    },
    {
      name: "Logout",
      link: "",
      status: session?.user.email ? "active" : "",
    },
  ];

  let thisCountCart: number | undefined = 0;

  if (session?.user.email) {
    const countCart = await getCountCart(session.user.email);

    thisCountCart = countCart;
  }

  const setting = await getSetting();

  return (
    <>
      <ToastContainer />

      <main className="min-h-screen !w-full overflow-x-hidden">
        <Navbar
          menus={menus}
          countCart={thisCountCart}
          status={session?.user.email ? "authenticated" : "unauthenticated"}
        />
        {children}
        <Footer settingValue={setting} />
      </main>
    </>
  );
};

export default ClientTemplate;
