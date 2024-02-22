"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuType } from "@/types/MenuType";
import { ShoppingCart } from "lucide-react";
import { CategoryFullType } from "@/types/CategoryType";
import NavbarSearch from "./NavbarSearch";
import NavbarDesktopMenu from "./NavbarDesktopMenu";
import NavbarMobileMenu from "./NavbarMobileMenu";
import NavbarMobileSearch from "./NavbarMobileSearch";
import { Kaushan_Script } from "next/font/google";
import localFont from "next/font/local";
import { useSession } from "next-auth/react";
import { useCartContext } from "@/context/CartContext";

const kaushan = Kaushan_Script({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

const prostestRiot = localFont({
  src: [{ path: "../../../public/ProtestRiot-Regular.ttf", weight: "400" }],
  display: "swap",
});

interface NavbarProps {
  role?: string;
  countCarts?: number;
  categories: CategoryFullType[];
}

const Navbar: React.FC<NavbarProps> = ({ countCarts, role, categories }) => {
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
      status: role ? "" : "active",
    },
    {
      name: "Login",
      link: "/login",
      status: role ? "" : "active",
    },
    {
      name: "Profile",
      link: "/profile",
      status: role ? "active" : "",
    },
    {
      name: "Logout",
      link: "",
      status: role ? "active" : "",
    },
  ];

  const [totalCarts, setTotalCarts] = useState<number | undefined>(undefined);

  const { status } = useSession();

  const { carts } = useCartContext();

  useEffect(() => {
    if (status === "unauthenticated") {
      if (!carts) {
        setTotalCarts(undefined);
      } else {
        setTotalCarts(carts.length);
      }
    }

    if (status === "authenticated") setTotalCarts(countCarts);
  }, [status, carts, countCarts]);

  return (
    <React.Fragment>
      <nav
        className={`w-full flex justify-center z-40 top-0 fixed bg-second-color text-primary-color text-sm font-semibold`}
      >
        <div className="w-[90%] h-[60px] lg:h-[100px] flex justify-between items-center font-serif shadow-sm">
          <NavbarMobileMenu menus={menus} />

          <Link href="/" className="gap-3 h-full items-center flex">
            <Image
              src="/logo.png"
              alt="logo"
              height={100}
              width={100}
              className="object-contain lg:w-[70px] lg:h-[70px] h-[30px] w-[30px]"
            />
            <div className="text-lg hidden sm:block">
              <div className={`text-3xl ${prostestRiot.className}`}>
                <span className="text-white">BOTTLE</span> TIME
              </div>
              <div
                className={`text-md text-white text-2xl ${kaushan.className}`}
              >
                bir wine spirit Bali
              </div>
            </div>
          </Link>

          <NavbarSearch className="hidden lg:block" />

          <NavbarMobileSearch />

          <NavbarDesktopMenu categories={categories} menus={menus} />

          <Link href="/cart" className="relative">
            <div className="relative h-fit w-fit">
              {totalCarts ? (
                <div className="absolute w-5 h-5 flex justify-center items-center rounded-full bg-red-500 text-xs -right-2 -top-2 text-white">
                  {totalCarts}
                </div>
              ) : null}
              <ShoppingCart width={25} height={25} />
            </div>
          </Link>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
