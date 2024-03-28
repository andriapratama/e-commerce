"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/types/CategoryType";

interface Props {
  status: "category" | "subCategory";
  categories: CategoryType[] | undefined;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}

const ProductSelect: React.FC<Props> = ({
  status,
  categories,
  category,
  setCategory,
}) => {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const categoryParams = searchParams.get("category");

  const handleChange = (value: string) => {
    setCategory(value);
    if (status === "category") {
      router.push(`${pathname}?category=${value}`);
    } else {
      router.push(
        `${pathname}?category=${categoryParams}&subCategory=${value}`
      );
    }
  };

  return (
    <Select onValueChange={handleChange} value={category}>
      <SelectTrigger className="w-[300px] capitalize">
        <SelectValue
          placeholder={
            status === "category" ? "Pilih kategori" : "Pilih sub kategori"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories
            ? categories.map((category: CategoryType, index) => (
                <SelectItem
                  key={index}
                  value={category.name}
                  className="capitalize"
                >
                  {category.name}
                </SelectItem>
              ))
            : null}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ProductSelect;
