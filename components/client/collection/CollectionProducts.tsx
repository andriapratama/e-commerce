import React from "react";

import { ClientProductType } from "@/types/ProductType";

import ProductCard from "../ProductCard";

interface CollectionProductsProps {
  products: ClientProductType[];
}

const CollectionProducts: React.FC<CollectionProductsProps> = ({
  products,
}) => {
  return (
    <div className="flex-1 grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mt-10">
      {products.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </div>
  );
};

export default CollectionProducts;
