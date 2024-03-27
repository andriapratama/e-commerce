"use client";

import axios from "axios";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import useSWR, { Fetcher } from "swr";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminMenus } from "@/constant/AdminMenus";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { AdminMenuType } from "@/types/MenuType";

import NavbarChangePassword from "./NavbarChangePassword";
import NavbarEditProfile from "./NavbarEditProfile";

interface NavbarProps {
  name: string | null | undefined;
  role: string | null | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ name, role }) => {
  const [isOpenEditProfile, setIsOpenEditProfile] = useState<boolean>(false);
  const [isOpenChangePassword, setIsOpenChangePassword] =
    useState<boolean>(false);
  const [nameSession, setNameSession] = useState<string>(name ? name : "");

  const pathname = usePathname();

  const { setIsLoadingPage } = useLoadingPageContext();

  const checkRole = (menu: AdminMenuType) => {
    if (role) {
      const isRole = menu.role.includes(role);

      if (!isRole) {
        return null;
      }

      return (
        <li className="nav-admin__link" key={menu.name}>
          <Link
            href={menu.link}
            onClick={() => handleSetLoadingPage(menu.link)}
          >
            {menu.name}
          </Link>
        </li>
      );
    }
  };

  const fetcher: Fetcher<{
    data: { image: string } | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR("/api/setting/logo/get", fetcher);

  const handleSetLoadingPage = (link: string) => {
    if (pathname !== link) setIsLoadingPage(true);
  };

  return (
    <React.Fragment>
      <nav className="w-full flex justify-between px-5 items-center h-12 border-b-2 border-slate-300 fixed bg-white z-20 shadow-md">
        {!data?.data ? null : (
          <Image
            src={data?.data?.image}
            alt="logo"
            width={100}
            height={100}
            className="w-[30px] h-[30px] object-contain"
            priority
          />
        )}
        <ul className="md:flex gap-5 text hidden text-base">
          {adminMenus.map((menu) => checkRole(menu))}
        </ul>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden md:block">
            <div className="cursor-pointer capitalize">{nameSession}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsOpenEditProfile(true)}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsOpenChangePassword(true)}>
              Ganti Password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog>
          <DialogTrigger asChild className="md:hidden">
            <Menu className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="!p-0 !pb-5">
            <DialogHeader className="pt-5 px-5">
              <DialogTitle>Menu</DialogTitle>
            </DialogHeader>
            <ul>{adminMenus.map((menu) => checkRole(menu))}</ul>

            <DialogHeader className="pt-5 px-5">
              <DialogTitle>Akun</DialogTitle>
            </DialogHeader>
            <ul>
              <li className="nav-admin__link-mobile !bg-transparent !cursor-default">
                {nameSession}
              </li>
              <li
                className="nav-admin__link-mobile"
                onClick={() => setIsOpenEditProfile(true)}
              >
                Edit Profile
              </li>
              <li
                className="nav-admin__link-mobile"
                onClick={() => setIsOpenChangePassword(true)}
              >
                Ganti Password
              </li>
              <li className="nav-admin__link-mobile" onClick={() => signOut()}>
                Keluar
              </li>
            </ul>
          </DialogContent>
        </Dialog>
      </nav>

      <NavbarEditProfile
        isOpen={isOpenEditProfile}
        setIsOpen={setIsOpenEditProfile}
        setNameSession={setNameSession}
      />

      <NavbarChangePassword
        isOpen={isOpenChangePassword}
        setIsOpen={setIsOpenChangePassword}
      />
    </React.Fragment>
  );
};

export default Navbar;
