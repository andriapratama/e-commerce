"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromoType } from "@/types/PromoType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonLoading from "@/components/ButtonLoading";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartContext } from "@/context/CartContext";
import { CartLocalType } from "@/types/CartType";

interface Props {
  promo: PromoType;
  totalStock: number;
}

const PromoDetailContent: React.FC<Props> = ({ promo, totalStock }) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isOpenImage, setIsOpenImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { carts, handleSetCarts } = useCartContext();

  const { status } = useSession();

  const router = useRouter();

  const params = useParams();

  const slug = params.id;

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
    if (quantity === totalStock) {
      setQuantity(totalStock);
      setMessage("Maximum stock that can be ordered!");
    } else {
      setQuantity((quantity) => quantity + 1);
      setMessage("");
    }
  };

  const handleSetQuantity = (value: string) => {
    if (value === "" || value === null || value === undefined) {
      setQuantity(0);
      setMessage("");
    } else if (parseInt(value) >= totalStock) {
      setQuantity(totalStock);
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
      if (status === "unauthenticated") storeDataToLocalStorage();

      if (status === "authenticated") storeDataToDB();
    }
  };

  const storeDataToDB = async () => {
    try {
      setIsLoading(true);

      await axios.post("/api/cart/promo/post", {
        promoSlug: slug,
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
      image: promo.image,
      name: promo.name,
      slug: promo.slug,
      status: true,
      price: promo.firstPrice,
      salePrice: promo.promoPrice,
      quantity: quantity,
      type: "promo",
      totalStock: totalStock,
      createdAt: new Date(),
    };

    if (!carts) {
      const newCarts = [cart];

      handleSetCarts(newCarts);
    } else {
      const findProductIndex = carts.findIndex((cart) => cart.slug === slug);

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
      <ToastContainer />

      <div className="w-full flex justify-center mt-[80px] lg:mt-[150px]">
        <div className="md:w-[80%] w-[90%] lg:flex block gap-5">
          <div className="lg:w-[60%] w-full flex justify-center relative">
            <Image
              src={promo.image}
              alt={promo.name}
              width={400}
              height={200}
              className="w-full h-auto object-contain rounded-md cursor-pointer"
              onClick={() => setIsOpenImage(true)}
              priority
            />
          </div>

          <div className="lg:w-[40%] w-full mt-5 lg:mt-0 font-serif">
            <h2 className="capitalize lg:text-2xl text-xl mb-3">
              {promo.name}
            </h2>

            <div className="w-fit text-gray-600 lg:text-xl text-base mb-4">
              {ConvertIDR(promo.firstPrice)}
              <div className="border -mt-3 border-black z-20"></div>
            </div>

            <div className="lg:text-3xl text-2xl mb-5 text-red-500">
              {ConvertIDR(promo.promoPrice)}
            </div>

            <p className="mb-5 leading-7 text-gray-600 lg:text-base text-sm">
              {promo.description}
            </p>

            <div className="mb-5 lg:text-base text-sm">
              {totalStock} piece available
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

      <Dialog open={isOpenImage} onOpenChange={setIsOpenImage}>
        <DialogContent className="!max-w-[90%] h-fit">
          <Image
            src={promo.image}
            alt="preview"
            height={2000}
            width={2000}
            className="object-cover h-auto !w-full"
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default PromoDetailContent;
