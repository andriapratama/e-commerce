import { AdminMenuType } from "@/types/MenuType";

export const adminMenus: AdminMenuType[] = [
  {
    name: "dashboard",
    link: "/admin",
    role: ["superAdmin", "admin"],
  },
  {
    name: "order",
    link: "/admin/orders",
    role: ["superAdmin", "admin"],
  },
  {
    name: "produk",
    link: "/admin/products",
    role: ["superAdmin"],
  },
  {
    name: "kategori",
    link: "/admin/categories",
    role: ["superAdmin"],
  },
  {
    name: "sub kategori",
    link: "/admin/sub-categories",
    role: ["superAdmin"],
  },
  {
    name: "pegawai",
    link: "/admin/employees",
    role: ["superAdmin"],
  },
  {
    name: "Hero",
    link: "/admin/heros",
    role: ["superAdmin"],
  },
  {
    name: "Promo",
    link: "/admin/promos",
    role: ["superAdmin"],
  },
  {
    name: "pelanggan",
    link: "/admin/users/member",
    role: ["superAdmin", "admin"],
  },
  {
    name: "tamu",
    link: "/admin/users/guest",
    role: ["superAdmin", "admin"],
  },
  {
    name: "pengaturan",
    link: "/admin/settings",
    role: ["superAdmin"],
  },
];
