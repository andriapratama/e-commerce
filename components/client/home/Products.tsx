"use client";

import React, { useEffect, useState } from "react";
import { Alegreya_SC, Lugrasimo } from "next/font/google";
import ProductCard from "../ProductCard";
import { ClientProductType } from "@/types/ProductType";
import Link from "next/link";

const lugrasimo = Lugrasimo({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const alegreya = Alegreya_SC({
  weight: "500",
  style: "italic",
  subsets: ["latin"],
});

interface ProductProps {
  products: ClientProductType[];
}

const Products: React.FC<ProductProps> = ({ products }) => {
  const [limit, setLimit] = useState<number>(8);

  const productsLimit = products.slice(0, limit);

  useEffect(() => {
    const widhtScreen = window.innerWidth;

    if (widhtScreen > 640 && widhtScreen < 1024) {
      setLimit(9);
    } else {
      setLimit(8);
    }
  }, [setLimit]);

  return (
    <section className="w-full flex justify-center md:mt-[100px] mt-16">
      <div className="lg:w-[80%] sm:w-[90%] w-[80%]">
        <div
          className={`w-full text-sm text-center text-yellow-600 ${lugrasimo.className}`}
        >
          Best of the Best
        </div>
        <div
          className={`md:text-5xl text-4xl w-full text-center mb-14 ${alegreya.className}`}
        >
          Which Your
        </div>

        <div className="w-full flex flex-wrap justify-between gap-3">
          {productsLimit.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>

        <div className="w-full flex justify-center mt-5">
          <Link
            href="/collections"
            className="px-20 py-2 rounded bg-yellow-600 text-white font-serif"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
