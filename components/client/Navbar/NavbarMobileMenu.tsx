"use client";

import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MenuType } from "@/types/MenuType";

import MobileLogo from "../MobileLogo";

interface Props {
  menus: MenuType[];
}

const NavbarMobileMenu: React.FC<Props> = ({ menus }) => {
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);

  const router = useRouter();

  return (
    <React.Fragment>
      <Menu
        width={25}
        height={25}
        className="lg:hidden block text-primary-color"
        onClick={() => setIsShowMenu(true)}
      />

      <Dialog open={isShowMenu} onOpenChange={setIsShowMenu}>
        <DialogContent className="!top-[40%] !p-0 !pb-5 font-serif">
          <DialogHeader className="pt-5 px-5"></DialogHeader>
          <DialogTitle className="w-full text-center uppercase">
            <MobileLogo />
          </DialogTitle>
          <DialogTitle className="w-full text-center uppercase mt-2">
            Menu
          </DialogTitle>
          <ul className="w-full h-fit mt-3">
            {menus.map((menu) => {
              if (menu.status === "active") {
                if (menu.name === "Logout") {
                  return (
                    <li
                      className="w-full text-center mb-3 uppercase"
                      key={menu.name}
                      onClick={() => {
                        signOut({
                          redirect: false,
                        });
                        router.push(`${process.env.NEXT_PUBLIC_WEB_URL}`);
                        setIsShowMenu(false);
                      }}
                    >
                      {menu.name}
                    </li>
                  );
                } else {
                  return (
                    <li
                      className="w-full text-center mb-3 uppercase"
                      key={menu.name}
                      onClick={() => setIsShowMenu(false)}
                    >
                      <Link href={menu.link}>{menu.name}</Link>
                    </li>
                  );
                }
              }
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default NavbarMobileMenu;
