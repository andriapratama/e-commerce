"use client";

import { CategoryType } from "@/types/CategoryType";
import { MenuType } from "@/types/MenuType";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  categories: CategoryType[];
  menus: MenuType[];
}

const NavbarDesktopMenu: React.FC<Props> = ({ categories, menus }) => {
  const [isOpenCategories, setIsOpenCategories] = useState<boolean>(false);

  const CategoriesContent = () => {
    return categories.map((category: CategoryType) => {
      return (
        <li className="w-fit text-center mx-10 capitalize" key={category.name}>
          <Link
            className="hover:border-b border-black"
            href={`/collections/?category=${category.name}&page=1`}
            onClick={() => setIsOpenCategories(false)}
          >
            {category.name}
          </Link>

          <ul className="mt-5">
            {category.subCategories.map(
              (subCategory: { name: string; slug: string }) => {
                return (
                  <li className="mb-3" key={subCategory.name}>
                    <Link
                      href={`/collections/?category=${category.name}&subCategory=${subCategory.name}&page=1`}
                      className="font-normal hover:border-b border-black"
                      key={subCategory.name}
                      onClick={() => setIsOpenCategories(false)}
                    >
                      {subCategory.name}
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
        </li>
      );
    });
  };

  return (
    <div className="h-full lg:flex items-center gap-7 hidden">
      {menus.map((menu: MenuType) => {
        if (menu.status === "active") {
          if (menu.name === "categories") {
            return (
              <div
                className="relative"
                key={menu.name}
                onMouseEnter={() => setIsOpenCategories(true)}
                onMouseLeave={() => setIsOpenCategories(false)}
              >
                <Link
                  href={menu.link}
                  className={`cursor-pointer hover:border-b-2 px-1 capitalize border-primary-color`}
                >
                  {menu.name}
                </Link>

                <div
                  className={`absolute top-5 left-10 z-50 -translate-x-[50%] ${
                    isOpenCategories ? "visible" : "invisible"
                  }`}
                >
                  <ul className="flex text-black w-fit h-fit pt-2 bg-white rounded-md border">
                    {CategoriesContent()}
                  </ul>
                </div>
              </div>
            );
          } else {
            return (
              <Link
                href={menu.link}
                key={menu.name}
                className={`cursor-pointer hover:border-b-2 px-1 capitalize border-primary-color`}
              >
                {menu.name}
              </Link>
            );
          }
        }
      })}
    </div>
  );
};

export default NavbarDesktopMenu;
