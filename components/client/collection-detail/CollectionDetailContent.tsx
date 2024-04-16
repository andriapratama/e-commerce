"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

import ButtonLoading from "@/components/ButtonLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartContext } from "@/context/CartContext";
import { CartLocalType } from "@/types/CartType";
import { ClientProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";

import ShowImage from "../ShowImage";
import StatusProduct from "../StatusProduct";

interface CollectionDetailContentProps {
  product: ClientProductType;
  slug: string;
}

const CollectionDetailContent: React.FC<CollectionDetailContentProps> = ({
  product,
  slug,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { carts, handleSetCarts } = useCartContext();

  const { status } = useSession();

  const router = useRouter();

  const handleDecrease = () => {
    if (quantity <= 0) {
      setQuantity(0);
      setMessage("");
    } else {
      setQuantity((quantity) => quantity - 1);
      setMessage("");
    }
  };

  const handleIncrease = () => {
    const total: number = product.totalStock;

    if (quantity === total) {
      setQuantity(total);
      setMessage("Maximum stock that can be ordered!");
    } else {
      setQuantity((quantity) => quantity + 1);
      setMessage("");
    }
  };

  const handleSetQuantity = (value: string) => {
    const total: number = product.totalStock;

    if (value === "" || value === null || value === undefined) {
      setQuantity(0);
      setMessage("");
    } else if (parseInt(value) >= total) {
      setQuantity(total);
      setMessage("Maximum stock that can be ordered!");
    } else {
      setQuantity(parseInt(value));
      setMessage("");
    }
  };

  const handleAddCart = async () => {
    if (quantity < 1) {
      setMessage("Quantity cannot be 0");
    } else {
      if (status === "unauthenticated") {
        storeDataToLocalStorage();
      } else if (status === "authenticated") {
        storeDataToDB();
      }
    }
  };

  const storeDataToDB = async () => {
    try {
      setIsLoading(true);

      await axios.post("/api/cart/product/post", {
        productSlug: slug,
        quantity,
      });

      toast.success("Order saved to cart");

      setQuantity(0);

      router.refresh();

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(true);
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
      quantity: quantity,
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
        newCarts[findProductIndex].quantity += quantity;

        handleSetCarts(newCarts);
      }
    }

    toast.success("Order saved to cart");

    setQuantity(0);
  };

  return (
    <React.Fragment>
      <div className="w-full lg:min-h-[calc(100vh-537px)] flex justify-center lg:mt-[150px] md:mt-[100px] mt-[80px] font-serif">
        <div className="md:w-[60%] sm:w-[80%] w-[90%] grid sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="w-full flex justify-center relative">
            <StatusProduct status={product.status} />
            <Image
              src={product.image}
              alt={product.slug}
              width={300}
              height={600}
              className="object-cover sm:h-[500px] md:h-[400px] h-[300px] w-auto rounded cursor-pointer"
              onClick={() => setIsOpenImage(true)}
              priority
            />
          </div>
          <div className="w-full">
            <h2 className="capitalize lg:text-2xl text-xl mb-3">
              {product.name}
            </h2>
            {product.status === "sale" ? (
              <>
                <div className="w-fit text-gray-600 lg:text-xl text-base mb-4">
                  {ConvertIDR(product.price)}
                  <div className="border -mt-3 border-black z-20"></div>
                </div>

                <div className="lg:text-3xl text-2xl mb-5 text-red-500">
                  {ConvertIDR(product.salePrice)}
                </div>
              </>
            ) : (
              <div className="lg:text-3xl text-2xl mb-5">
                {ConvertIDR(product.price)}
              </div>
            )}
            <p className="mb-5 leading-7 text-gray-600 lg:text-base text-sm">
              {product.description}
            </p>

            <div className="mb-5 lg:text-base text-sm">
              {product.totalStock} piece available
            </div>

            <div className="flex mb-5 lg:w-[200px] md:w-[90%] w-[80%] md:mx-0 mx-auto gap-2">
              <Button variant="outline" onClick={() => handleDecrease()}>
                -
              </Button>
              <Input
                type="text"
                value={quantity}
                onChange={(e) => handleSetQuantity(e.target.value)}
                className="text-center"
              />
              <Button variant="outline" onClick={() => handleIncrease()}>
                +
              </Button>
            </div>
            {message ? (
              <div className="text-sm text-red-500 mb-5 -mt-4">{message}</div>
            ) : null}

            <div className="flex md:w-[90%] w-[80%] md:mx-0 mx-auto lg:w-[300px] gap-3">
              <Button
                className="w-full"
                type="button"
                onClick={() => handleAddCart()}
                disabled={isLoading}
              >
                {isLoading ? <ButtonLoading /> : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ShowImage
        isOpen={isOpenImage}
        setIsOpen={setIsOpenImage}
        image={product.image}
      />
    </React.Fragment>
  );
};

export default CollectionDetailContent;
