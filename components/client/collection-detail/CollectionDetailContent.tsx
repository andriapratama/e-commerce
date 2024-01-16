"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClientProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShowImage from "../ShowImage";
import StatusProduct from "../StatusProduct";
import { toast } from "react-toastify";
import ButtonLoading from "@/components/ButtonLoading";
import axios from "axios";
import { useRouter } from "next/navigation";

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
    try {
      setIsLoading(true);

      await axios.post("/api/cart", {
        productSlug: slug,
        quantity,
      });

      toast.success("Order saved in cart");

      setQuantity(0);

      router.refresh();

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(true);
    }
  };

  return (
    <React.Fragment>
      <div className="w-full flex justify-center lg:mt-[150px] md:mt-[100px] mt-[80px] font-serif">
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

                <h2 className="lg:text-3xl text-2xl mb-5 text-red-500">
                  {ConvertIDR(product.salePrice)}
                </h2>
              </>
            ) : (
              <h2 className="lg:text-3xl text-2xl mb-5">
                {ConvertIDR(product.price)}
              </h2>
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
