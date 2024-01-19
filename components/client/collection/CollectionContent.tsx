"use client";

import { CategoryType } from "@/types/CategoryType";
import React, { useEffect, useState } from "react";
import SearchByCategory from "./SearchByCategory";
import CollectionProducts from "./CollectionProducts";
import { ClientProductType } from "@/types/ProductType";
import Pagination from "../Pagination";
import { useSearchParams } from "next/navigation";

interface CollectionContentProps {
  categories: CategoryType[];
  products: ClientProductType[];
  totalPage: number;
}

const CollectionContent: React.FC<CollectionContentProps> = ({
  categories,
  products,
  totalPage,
}) => {
  const [title, setTitle] = useState<string>("All Products");

  const searchParams = useSearchParams();

  const categoryParams = searchParams.get("category");

  const subCategoryParams = searchParams.get("subCategory");

  const statusParams = searchParams.get("status");

  useEffect(() => {
    if (categoryParams && subCategoryParams) {
      setTitle(subCategoryParams);
    } else if (categoryParams) {
      setTitle(categoryParams);
    } else if (statusParams) {
      setTitle(statusParams);
    } else {
      setTitle("All Products");
    }
  });

  return (
    <React.Fragment>
      <div className="w-full flex justify-center mt-[80px] lg:mt-[150px]">
        <div className="w-[90%] flex gap-5">
          <div className="w-full">
            <div className="w-full text-center text-2xl font-serif font-semibold mb-3 capitalize">
              {title}
            </div>

            <SearchByCategory categories={categories} />

            <CollectionProducts products={products} />

            <Pagination totalPage={totalPage} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CollectionContent;
