import { ClientProductType } from "@/types/ProductType";
import React from "react";
import ProductCard from "../ProductCard";
import { ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";

interface CollectionProductsProps {
  products: ClientProductType[];
}

const CollectionProducts: React.FC<CollectionProductsProps> = ({
  products,
}) => {
  const { status } = useSession();

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="flex-1 grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mt-10">
        {products.map((product) => (
          <ProductCard product={product} key={product.slug} status={status} />
        ))}
      </div>
    </React.Fragment>
  );
};

export default CollectionProducts;
