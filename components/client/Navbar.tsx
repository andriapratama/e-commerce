"use client";

import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MenuType {
  name: string;
  link: string;
}

const menus: MenuType[] = [
  {
    name: "home",
    link: "/",
  },
  {
    name: "collections",
    link: "/collections",
  },
];

const Navbar = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [positionY, setPositionY] = useState<number>(0);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  useEffect(() => {
    const widhtScreen = window.innerWidth;

    const scroll = (event: any) => {
      setPositionY(window.scrollY);
    };

    window.addEventListener("scroll", scroll, false);

    if (widhtScreen < 640) {
      if (positionY > 550) {
        setIsActive(true);
      } else if (positionY < 550) {
        setIsActive(false);
      }
    } else {
      if (positionY > 800) {
        setIsActive(true);
      } else if (positionY < 800) {
        setIsActive(false);
      }
    }
  }, [setPositionY, positionY, setIsActive]);
  return (
    <nav
      className={`w-full flex justify-center z-40 duration-100 transition-all ease-in-out ${
        isActive
          ? "fixed top-0 bg-white shadow text-gray-700"
          : "absolute sm:top-[35px] top-[40px] bg-gradient-to-b from-black to-transparent text-gray-200"
      }`}
    >
      <div className="w-[80%] h-[60px] flex justify-between items-center font-serif">
        <div className="hidden lg:block">Logo</div>
        <div className="h-full lg:flex items-center gap-7 hidden">
          {menus.map((menu) => (
            <Link
              href={menu.link}
              key={menu.name}
              className={`cursor-pointer hover:border-b-2 px-1 uppercase ${
                isActive ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {menu.name}
            </Link>
          ))}
        </div>

        <Menu
          width={25}
          height={25}
          className="lg:hidden block"
          onClick={() => setIsShowMenu(true)}
        />

        <Dialog open={isShowMenu} onOpenChange={setIsShowMenu}>
          <DialogContent className="!p-0 !pb-5">
            <DialogHeader className="pt-5 px-5"></DialogHeader>
            <DialogTitle className="w-full text-center uppercase">
              Logo
            </DialogTitle>
            <DialogTitle className="w-full text-center uppercase font-serif">
              Menu
            </DialogTitle>
            <ul className="w-full h-fit mt-5">
              {menus.map((menu) => (
                <li
                  className="w-full text-center mb-3 uppercase font-serif"
                  key={menu.name}
                  onClick={() => setIsShowMenu(false)}
                >
                  <Link href={menu.link}>{menu.name}</Link>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
        <div>
          <ShoppingBag width={25} height={25} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
