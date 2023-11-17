import { ClientProductType } from "@/types/ProductType";
import React from "react";
import ProductCard from "../ProductCard";
import { ToastContainer } from "react-toastify";

interface CollectionProductsProps {
  products: ClientProductType[];
}

const CollectionProducts: React.FC<CollectionProductsProps> = ({
  products,
}) => {
  return (
    <React.Fragment>
      <ToastContainer />
      <div className="flex-1 grid sm:grid-cols-3 grid-cols-1 gap-4 mt-10">
        {products.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </div>
    </React.Fragment>
  );
};

export default CollectionProducts;
