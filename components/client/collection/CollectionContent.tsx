import { CategoryType } from "@/types/CategoryType";
import React from "react";
import SearchByName from "./SearchByName";
import SearchByCategory from "./SearchByCategory";
import CollectionProducts from "./CollectionProducts";
import CollectionCategories from "./CollectionCategories";
import { ClientProductType } from "@/types/ProductType";

interface CollectionContentProps {
  categories: CategoryType[];
  products: ClientProductType[];
}

const CollectionContent: React.FC<CollectionContentProps> = ({
  categories,
  products,
}) => {
  return (
    <div className="w-full flex justify-center mt-5">
      <div className="w-[90%] flex gap-5 mt-[100px]">
        <div className="w-full">
          <SearchByName />

          <SearchByCategory categories={categories} />

          <CollectionProducts products={products} />
        </div>
        <CollectionCategories categories={categories} />
      </div>
    </div>
  );
};

export default CollectionContent;
