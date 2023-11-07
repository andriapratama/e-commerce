import { ProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { ShoppingCart } from "lucide-react";
import { Lugrasimo, Junge } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const lugrasimo = Lugrasimo({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const junge = Junge({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

interface ProductCardProps {
  product: ProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="lg:w-[23.5%] sm:w-[30%] w-full h-fit mb-6 hover:shadow">
      <Link href={`/collections/${product.slug}`}>
        <div className="w-full flex justify-center h-fit relative">
          {product.status === "sale" ||
          product.status === "best" ||
          product.status === "new" ? (
            <div
              className={`absolute text-sm px-3 py-[2px] font-serif capitalize top-0 left-2 rounded text-white ${
                product.status === "sale"
                  ? "bg-red-500"
                  : product.status === "new"
                  ? "bg-blue-500"
                  : product.status === "best"
                  ? "bg-yellow-600"
                  : ""
              }`}
            >
              {product.status === "best" ? "Best Seller" : product.status}
            </div>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-contain w-auto lg:h-[300px] h-[150px] rounded-md"
            priority
          />
        </div>
      </Link>

      <div
        className={`w-full text-center ${lugrasimo.className} text-sm text-yellow-600 mt-4`}
      >
        {product.category.name}
      </div>

      <div
        className={`text-base lg:text-xl font-serif w-full text-center mt-2 px-7 ${junge.className}`}
      >
        {product.name}
      </div>

      <div
        className={`w-full flex justify-center mt-2 relative ${junge.className}`}
      >
        {product.status === "sale" ? (
          <div className="block">
            <div className="w-fit text-gray-600">
              {ConvertIDR(product.price)}
              <div className="border -mt-3 border-black z-20"></div>
            </div>

            <div className="mt-3 text-red-700">
              {ConvertIDR(product.salePrice)}
            </div>
          </div>
        ) : (
          ConvertIDR(product.price)
        )}
      </div>

      <div className="w-full flex justify-center items-center gap-5 my-5">
        {product.linkGojek ? (
          <Link href={product.linkGojek}>
            <Image
              src="/gojek.svg"
              alt="gojek"
              width={35}
              height={35}
              className="object-contain cursor-pointer"
            />
          </Link>
        ) : null}
        <ShoppingCart width={30} height={30} />
      </div>
    </div>
  );
};

export default ProductCard;
