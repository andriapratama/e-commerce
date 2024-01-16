import { ClientProductType } from "@/types/ProductType";
import React, { Dispatch, SetStateAction } from "react";
import ProductCard from "../ProductCard";
import { ToastContainer } from "react-toastify";

interface CollectionProductsProps {
  products: ClientProductType[];
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
}

const CollectionProducts: React.FC<CollectionProductsProps> = ({
  products,
  setIsLoadingPage,
}) => {
  return (
    <React.Fragment>
      <ToastContainer />
      <div className="flex-1 grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mt-10">
        {products.map((product) => (
          <ProductCard
            product={product}
            key={product.slug}
            setIsLoadingPage={setIsLoadingPage}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default CollectionProducts;
