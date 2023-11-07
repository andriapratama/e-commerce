"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/types/CategoryType";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SearchByCategoryProps {
  categories: CategoryType[];
}

const SearchByCategory: React.FC<SearchByCategoryProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSetOpen = () => {
    if (isOpen === false) {
      setIsOpen(true);
    } else if (isOpen === true) {
      setTimeout(() => {
        setIsOpen(false);
      }, 50);
    }
  };

  return (
    <div className="w-full mt-5 lg:hidden">
      <Select open={isOpen} onOpenChange={handleSetOpen}>
        <SelectTrigger className="w-full capitalize">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="capitalize">Categories</SelectLabel>
            {categories.map((category) => (
              <SelectItem
                value={category.slug}
                className="capitalize"
                key={category.slug}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchByCategory;
