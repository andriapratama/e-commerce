"use client";

import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { Junge } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { useCartContext } from "@/context/CartContext";
import { CartLocalType } from "@/types/CartType";
import { ClientProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";

import LoadingGif from "../LoadingGif";

const junge = Junge({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
});

interface ProductCardProps {
  product: ClientProductType;
  status: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, status }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { carts, handleSetCarts } = useCartContext();

  const router = useRouter();

  const handleAddCart = async () => {
    if (status === "unauthenticated") storeDataToLocalStorage();

    if (status === "authenticated") storeDataToDB();
  };

  const storeDataToDB = async () => {
    try {
      setIsLoading(true);

      await axios.post("/api/cart/product/post", {
        productSlug: product.slug,
        quantity: 1,
      });

      toast.success("Order saved to cart");

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const storeDataToLocalStorage = () => {
    const cart: CartLocalType = {
      image: product.image,
      name: product.name,
      slug: product.slug,
      status: true,
      price: product.price,
      salePrice: product.salePrice ? product.salePrice : 0,
      quantity: 1,
      type: "product",
      totalStock: product.totalStock,
      createdAt: new Date(),
    };

    if (!carts) {
      const newCarts = [cart];

      handleSetCarts(newCarts);
    } else {
      const findProductIndex = carts.findIndex(
        (cart) => cart.slug === product.slug
      );

      if (findProductIndex === -1) {
        const newCarts = [...carts, cart];

        handleSetCarts(newCarts);
      } else {
        let newCarts = [...carts];
        newCarts[findProductIndex].quantity += 1;

        handleSetCarts(newCarts);
      }
    }

    toast.success("Order saved to cart");
  };

  return (
    <React.Fragment>
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
          className={`w-full text-center lg:text-sm text-xs text-yellow-600 mt-4 ${junge.className}`}
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
            <div className="pb-2">
              <LoadingGif />
            </div>
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
    </React.Fragment>
  );
};

export default ProductCard;
