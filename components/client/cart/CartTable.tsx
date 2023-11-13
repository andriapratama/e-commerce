"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { CartType } from "@/types/CartType";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import LoadingGif from "@/components/LoadingGif";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

interface CartTableProps {
  carts?: CartType[];
}

const CartTable: React.FC<CartTableProps> = ({ carts }) => {
  const [cartList, setCartList] = useState<CartType[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (carts) {
      let thisCarts: CartType[] = [...carts];

      carts.map((cart, index) => {
        thisCarts[index].isLoading = false;
      });

      setCartList(thisCarts);
    }
  }, [setCartList, carts]);

  const handleIncrease = (index: number) => {
    const thisCarts = [...cartList];

    const total = thisCarts[index].product.totalStock;

    if (thisCarts[index].quantity >= total) {
      thisCarts[index].quantity = total;
    } else {
      thisCarts[index].quantity = thisCarts[index].quantity + 1;
    }

    setCartList(thisCarts);

    handleTotal(thisCarts[index].quantity, index);

    handelUpdate(thisCarts[index].id, thisCarts[index].quantity);
  };

  const handleDecrease = (index: number) => {
    const thisCarts = [...cartList];

    if (thisCarts[index].quantity <= 0 || !thisCarts[index].quantity) {
      thisCarts[index].quantity = 0;
    } else {
      thisCarts[index].quantity = thisCarts[index].quantity - 1;
    }

    setCartList(thisCarts);

    handleTotal(thisCarts[index].quantity, index);

    handelUpdate(thisCarts[index].id, thisCarts[index].quantity);
  };

  const handleSetQuantity = (quantity: number, index: number) => {
    const thisCarts = [...cartList];

    const total = thisCarts[index].product.totalStock;

    if (quantity >= total) {
      thisCarts[index].quantity = total;
    } else if (quantity <= 0 || !quantity) {
      thisCarts[index].quantity = 0;
    } else {
      thisCarts[index].quantity = quantity;
    }

    setCartList(thisCarts);

    handleTotal(thisCarts[index].quantity, index);

    handelUpdate(thisCarts[index].id, thisCarts[index].quantity);
  };

  const handleTotal = (quantity: number, index: number) => {
    const thisCarts = [...cartList];

    const price = thisCarts[index].product.price;

    const total = quantity * price;

    thisCarts[index].total = total;

    setCartList(thisCarts);
  };

  const handleDelete = async (index: number) => {
    const thisCarts = [...cartList];

    const cartId = thisCarts[index].id;

    try {
      thisCarts[index].isLoading = true;

      setCartList(thisCarts);

      await axios.delete(`/api/cart/delete/${cartId}`);

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      thisCarts[index].isLoading = false;

      setCartList(thisCarts);
    }
  };

  const handelUpdate = async (cartId: string, quantity: number) => {
    await axios.patch("/api/cart/update", {
      cartId,
      quantity,
    });
  };

  const handleChecked = async (cartId: string) => {
    try {
      await axios.patch(`/api/cart/check/${cartId}`);

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="w-full flex justify-center mt-[50px] font-serif">
        <div className="w-[80%]">
          <Table className="bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">#</TableHead>
                <TableHead className="text-center">Gambar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartList.length > 0 ? (
                cartList.map((cart: CartType, index) => (
                  <TableRow key={cart.product.slug}>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={cart.status}
                        onCheckedChange={() => handleChecked(cart.id)}
                      />
                    </TableCell>

                    <TableCell className="flex justify-center items-center">
                      <Image
                        src={cart.product.image}
                        alt={cart.product.name}
                        width={50}
                        height={50}
                        className="object-contain h-[50px] w-auto"
                      />
                    </TableCell>
                    <TableCell className="capitalize">
                      {cart.product.name}
                    </TableCell>
                    <TableCell>
                      {cart.product.status === "sale" ? (
                        <div className="block">
                          <div className="w-fit text-gray-600">
                            {ConvertIDR(cart.product.price)}
                            <div className="border -mt-3 border-black z-20"></div>
                          </div>

                          <div className="mt-3 text-red-700">
                            {ConvertIDR(cart.product.salePrice)}
                          </div>
                        </div>
                      ) : (
                        ConvertIDR(cart.product.price)
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecrease(index)}
                        >
                          -
                        </Button>
                        <Input
                          type="text"
                          className="text-center w-[100px] h-9"
                          value={cart.quantity}
                          onChange={(e) =>
                            handleSetQuantity(parseInt(e.target.value), index)
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIncrease(index)}
                        >
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cart.product.status === "sale" ? (
                        <div className="block">
                          <div className="w-fit text-gray-600">
                            {ConvertIDR(cart.product.price * cart.quantity)}
                            <div className="border -mt-3 border-black z-20"></div>
                          </div>

                          <div className="mt-3 text-red-700">
                            {ConvertIDR(cart.product.salePrice * cart.quantity)}
                          </div>
                        </div>
                      ) : (
                        ConvertIDR(cart.total)
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {cart.isLoading ? (
                          <LoadingGif />
                        ) : (
                          <Trash2
                            className="text-red-500 cursor-pointer"
                            width={18}
                            height={18}
                            onClick={() => handleDelete(index)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Empty data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CartTable;
