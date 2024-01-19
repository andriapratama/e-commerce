"use client";

import { ClientProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { ShoppingCart } from "lucide-react";
import { Lugrasimo, Junge } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingGif from "../LoadingGif";

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
  product: ClientProductType;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleAddCart = async () => {
    try {
      setIsLoading(true);

      const res = await axios.post("/api/cart", {
        productSlug: product.slug,
        quantity: 1,
      });

      toast.success(res.data.message);

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-fit mb-6 hover:shadow">
      <div
        className="w-full flex justify-center h-fit relative cursor-pointer"
        onClick={() => {
          router.push(`/collections/${product.slug}`);
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-contain w-auto lg:h-[300px] md:h-[200px] h-[120px] rounded-md"
          priority
        />
      </div>

      <div
        className={`w-full text-center ${lugrasimo.className} lg:text-sm text-xs text-yellow-600 mt-4`}
      >
        {product.category.name}
      </div>

      <div
        className={`text-sm md:text-base lg:text-xl font-serif w-full text-center mt-2 px-7 ${junge.className}`}
      >
        {product.name}
      </div>

      <div
        className={` text-sm lg:text-base w-full flex justify-center mt-2 relative ${junge.className}`}
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

      <div className="w-full flex justify-center items-center gap-5 my-3 lg:my-5 md:my-4">
        {product.linkGojek ? (
          <Link href={product.linkGojek} target="blank">
            <Image
              src="/gojek.svg"
              alt="gojek"
              width={35}
              height={35}
              className="object-contain cursor-pointer lg:w-[35px] lg:h-[35px] w-[25px] h-[25px]"
            />
          </Link>
        ) : null}
        {isLoading ? (
          <LoadingGif />
        ) : (
          <ShoppingCart
            width={30}
            height={30}
            className="cursor-pointer lg:w-[30px] lg:h-[30px] w-[20px] h-[20px]"
            onClick={() => handleAddCart()}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
