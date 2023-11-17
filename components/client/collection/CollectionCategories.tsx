import { CategoryType } from "@/types/CategoryType";
import { ChevronRight } from "lucide-react";
import React from "react";

interface CollectionCategoriesProps {
  categories: CategoryType[];
}

const CollectionCategories: React.FC<CollectionCategoriesProps> = ({
  categories,
}) => {
  return (
    <div className="w-[310px] h-fit hidden lg:block mt-[80px]">
      <div className="text-xl font-serif mb-5">Categories</div>
      {categories.map((category) => (
        <div
          className="flex justify-between items-center border-b w-full pl-1 capitalize mb-3 cursor-pointer font-serif py-2 hover:text-yellow-600"
          key={category.slug}
        >
          {category.name}
          <ChevronRight width={15} height={15} />
        </div>
      ))}
    </div>
  );
};

export default CollectionCategories;
