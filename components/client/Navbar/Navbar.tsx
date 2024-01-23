"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuType } from "@/types/MenuType";
import { ShoppingCart } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { CategoryFullType } from "@/types/CategoryType";
import NavbarSearch from "./NavbarSearch";
import NavbarDesktopMenu from "./NavbarDesktopMenu";
import NavbarMobileMenu from "./NavbarMobileMenu";
import NavbarMobileSearch from "./NavbarMobileSearch";

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

  return (
    <React.Fragment>
      <ToastContainer />
      <nav
        className={`w-full flex justify-center z-40 top-0 fixed bg-second-color text-primary-color text-sm font-semibold`}
      >
        <div className="w-[90%] h-[60px] lg:h-[100px] flex justify-between items-center font-serif shadow-sm">
          <NavbarMobileMenu menus={menus} />

          <Link href="/" className="gap-3 h-full items-center flex">
            <Image
              src="/logo.png"
              alt="logo"
              height={45}
              width={45}
              className="object-contain lg:w-[45px] lg:h-[45px] h-[30px] w-[30px]"
            />
            <div className="uppercase text-lg hidden sm:block">
              <span className="text-white">Bottle</span> Time
            </div>
          </Link>

          <NavbarSearch className="hidden lg:block" />

          <NavbarMobileSearch />

          <NavbarDesktopMenu categories={categories} menus={menus} />

          <Link href="/cart" className="relative">
            <div className="relative h-fit w-fit">
              {countCarts ? (
                <div className="absolute w-5 h-5 flex justify-center items-center rounded-full bg-red-500 text-xs -right-2 -top-2 text-white">
                  {countCarts}
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
