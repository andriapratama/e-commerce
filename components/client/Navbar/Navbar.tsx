"use client";

import { ShoppingCart } from "lucide-react";
import { Kaushan_Script } from "next/font/google";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useCartContext } from "@/context/CartContext";
import { MenuType } from "@/types/MenuType";

import NavbarDesktopMenu from "./NavbarDesktopMenu";
import NavbarMobileMenu from "./NavbarMobileMenu";
import NavbarMobileSearch from "./NavbarMobileSearch";
import NavbarSearch from "./NavbarSearch";

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
  status: "authenticated" | "unauthenticated";
  countCart: number | undefined;
  menus: MenuType[];
}

const Navbar: React.FC<NavbarProps> = ({ countCart, status, menus }) => {
  const [totalCart, setTotalCart] = useState<number | undefined>(undefined);

  const { carts } = useCartContext();

  useEffect(() => {
    if (status === "unauthenticated") {
      if (!carts) {
        setTotalCart(undefined);
      } else {
        setTotalCart(carts.length);
      }
    }

    if (status === "authenticated") setTotalCart(countCart);
  }, [status, countCart, carts]);

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
            <div className="text-lg hidden lg:block">
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

          <NavbarDesktopMenu menus={menus} />

          <Link href="/cart" className="relative">
            <div className="relative h-fit w-fit">
              {totalCart ? (
                <div className="absolute w-5 h-5 flex justify-center items-center rounded-full bg-red-500 text-xs -right-2 -top-2 text-white">
                  {totalCart}
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
