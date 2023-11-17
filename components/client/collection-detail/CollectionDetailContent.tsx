"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClientProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShowImage from "../ShowImage";
import StatusProduct from "../StatusProduct";

interface CollectionDetailContentProps {
  product: ClientProductType;
}

const CollectionDetailContent: React.FC<CollectionDetailContentProps> = ({
  product,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);

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

  return (
    <React.Fragment>
      <div className="w-full flex justify-center mt-[50px] font-serif">
        <div className="sm:w-[60%] w-[90%] grid sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="w-full justify-center relative">
            <StatusProduct status={product.status} />
            <Image
              src={product.image}
              alt={product.slug}
              width={300}
              height={600}
              className="object-cover sm:h-[600px] h-[400px] w-auto rounded cursor-pointer"
              onClick={() => setIsOpenImage(true)}
            />
          </div>
          <div className="w-full">
            <h2 className="capitalize text-2xl mb-3">{product.name}</h2>
            <div className="mb-5">100 sold</div>
            {product.status === "sale" ? (
              <>
                <div className="w-fit text-gray-600 text-xl mb-4">
                  {ConvertIDR(product.price)}
                  <div className="border -mt-3 border-black z-20"></div>
                </div>

                <h2 className="text-3xl mb-5 text-red-500">
                  {ConvertIDR(product.salePrice)}
                </h2>
              </>
            ) : (
              <h2 className="text-3xl mb-5">{ConvertIDR(product.price)}</h2>
            )}
            <p className="mb-5 leading-8 text-gray-600">
              {product.description}
            </p>

            <div className="flex mb-5 sm:w-[200px] w-full gap-2">
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

            <div className="mb-5">{product.totalStock} piece available</div>

            <div className="flex w-full sm:w-[300px] gap-3">
              <Button className="w-full">Add to Cart</Button>
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
