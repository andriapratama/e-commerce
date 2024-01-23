"use client";

import { CategoryFullType } from "@/types/CategoryType";
import { LayoutGrid } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MobileLogo from "../MobileLogo";
import Link from "next/link";

interface SearchByCategoryProps {
  categories: CategoryFullType[];
}

const SearchByCategory: React.FC<SearchByCategoryProps> = ({ categories }) => {
  const [isOpenCategory, setIsOpenCategory] = useState<boolean>(false);

  return (
    <React.Fragment>
      <div
        className="flex gap-2 items-center lg:hidden"
        onClick={() => setIsOpenCategory(true)}
      >
        <LayoutGrid width={25} height={25} className="text-black" />
        <div>Select Category</div>
      </div>

      <Dialog open={isOpenCategory} onOpenChange={setIsOpenCategory}>
        <DialogContent className="!top-[50%] !p-0 !pb-5 font-serif max-h-[70vh] overflow-y-auto w-full">
          <DialogHeader className="pt-5 px-5"></DialogHeader>
          <DialogTitle>
            <MobileLogo />
          </DialogTitle>
          <DialogTitle className="w-full text-center uppercase mt-2">
            Categories
          </DialogTitle>

          <ul>
            {categories.map((category: CategoryFullType) => (
              <li
                className="w-full text-center font-semibold capitalize mt-5"
                key={category.name}
              >
                <Link
                  href={`collections?category=${category.name}&page=1`}
                  onClick={() => {
                    setIsOpenCategory(false);
                  }}
                >
                  {category.name}
                </Link>

                <ul>
                  {category.subCategories.map(
                    (subCategory: { name: string; slug: string }) => (
                      <li
                        className="w-full text-center capitalize font-light mt-2"
                        key={subCategory.name}
                      >
                        <Link
                          href={`collections?category=${category.name}&subCategory=${subCategory.name}&page=1`}
                          onClick={() => {
                            setIsOpenCategory(false);
                          }}
                        >
                          {subCategory.name}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SearchByCategory;
