"use client";
import { Menu } from "lucide-react";
import React from "react";
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
import { signOut, useSession } from "next-auth/react";

interface MenuType {
  name: string;
  link: string;
  role: string[];
}

const menus: MenuType[] = [
  {
    name: "order",
    link: "/admin/orders",
    role: ["super admin", "admin"],
  },
  {
    name: "produk",
    link: "/admin/products",
    role: ["super admin"],
  },
  {
    name: "kategori",
    link: "/admin/categories",
    role: ["super admin"],
  },
  {
    name: "pegawai",
    link: "/admin/employees",
    role: ["super admin"],
  },
  {
    name: "pelanggan",
    link: "/admin/users",
    role: ["super admin", "admin"],
  },
  {
    name: "tamu",
    link: "/admin/guests",
    role: ["super admin", "admin"],
  },
];

const Navbar = () => {
  const { data: session } = useSession();

  const name = session?.user.name;
  const role = session?.user.role;

  const checkRole = (menu: MenuType) => {
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

  return (
    <nav className="w-full flex justify-between px-5 items-center h-12 border-b-2 border-slate-300 fixed bg-white z-20 shadow-md">
      <h1>Logo</h1>
      <ul className="md:flex gap-5 text hidden text-base">
        {menus.map((menu) => checkRole(menu))}
      </ul>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hidden md:block">
          <div className="cursor-pointer capitalize">{name}</div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit Profile</DropdownMenuItem>
          <DropdownMenuItem>Ganti Password</DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Keluar</DropdownMenuItem>
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
          <ul>{menus.map((menu) => checkRole(menu))}</ul>

          <DialogHeader className="pt-5 px-5">
            <DialogTitle>Akun</DialogTitle>
          </DialogHeader>
          <ul>
            <li className="nav-admin__link-mobile !bg-transparent !cursor-default">
              Cindy
            </li>
            <li className="nav-admin__link-mobile">Edit Profile</li>
            <li className="nav-admin__link-mobile">Ganti Password</li>
            <li className="nav-admin__link-mobile">Keluar</li>
          </ul>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
