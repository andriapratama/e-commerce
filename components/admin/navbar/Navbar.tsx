"use client";

import { Menu } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import { AdminMenuType } from "@/types/MenuType";
import { adminMenus } from "@/constant/AdminMenus";
import NavbarEditProfile from "./NavbarEditProfile";
import NavbarChangePassword from "./NavbarChangePassword";

interface NavbarProps {
  name: string | null | undefined;
  role: string | null | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ name, role }) => {
  const [image, setImage] = useState<string>("");
  const [isOpenEditProfile, setIsOpenEditProfile] = useState<boolean>(false);
  const [isOpenChangePassword, setIsOpenChangePassword] =
    useState<boolean>(false);
  const [nameSession, setNameSession] = useState<string>(name ? name : "");

  const checkRole = (menu: AdminMenuType) => {
    if (role) {
      const isRole = menu.role.includes(role);

      if (!isRole) {
        return null;
      }

      return (
        <li className="nav-admin__link" key={menu.name}>
          <Link href={menu.link}>{menu.name}</Link>
        </li>
      );
    }
  };

  const getLogo = useCallback(async () => {
    try {
      const res = await axios.get("/api/setting/logo/get");

      setImage(res.data.data.image);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    getLogo();
  }, []);

  return (
    <React.Fragment>
      <nav className="w-full flex justify-between px-5 items-center h-12 border-b-2 border-slate-300 fixed bg-white z-20 shadow-md">
        {image && (
          <Image
            src={image}
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
