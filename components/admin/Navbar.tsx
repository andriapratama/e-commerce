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

interface MenuType {
  name: string;
  link: string;
}

const menus: MenuType[] = [
  {
    name: "orders",
    link: "/admin/orders",
  },
  {
    name: "products",
    link: "/admin/products",
  },
  {
    name: "categories",
    link: "/admin/categories",
  },
  {
    name: "employees",
    link: "/admin/employees",
  },
  {
    name: "users",
    link: "/admin/users",
  },
  {
    name: "guests",
    link: "/admin/guests",
  },
];

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between px-5 items-center h-12 border-b-2 border-slate-300 fixed bg-white z-20 shadow-md">
      <h1>Logo</h1>
      <ul className="md:flex gap-5 text hidden text-base">
        {menus.map((menu) => (
          <li className="nav-admin__link" key={menu.name}>
            <Link href={menu.link}>{menu.name}</Link>
          </li>
        ))}
      </ul>
      <div className="hidden md:block">Cindy</div>

      <Dialog>
        <DialogTrigger asChild className="md:hidden">
          <Menu className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="!p-0 !pb-5">
          <DialogHeader className="pt-5 px-5">
            <DialogTitle>Menu</DialogTitle>
          </DialogHeader>
          <ul>
            {menus.map((menu) => (
              <li className="nav-admin__link-mobile" key={menu.name}>
                <Link href={menu.link}>{menu.name}</Link>
              </li>
            ))}
          </ul>

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
