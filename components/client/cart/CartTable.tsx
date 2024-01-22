"use client";

import axios from "axios";
import CartTotal from "./CartTotal";
import { CartType } from "@/types/CartType";
import { useRouter } from "next/navigation";
import CartTablePromo from "./CartTablePromo";
import CartTableProduct from "./CartTableProduct";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingGif from "@/components/LoadingGif";
import { Trash2 } from "lucide-react";
import CartMobileTableProduct from "./CartMobileTableProduct";
import CartMobileTablePromo from "./CartMobileTablePromo";

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

  const handleChecked = async (index: number) => {
    const thisCarts = [...cartList];

    const cartId = thisCarts[index].id;

    thisCarts[index].status = !thisCarts[index].status;

    setCartList(thisCarts);

    try {
      await axios.patch(`/api/cart/check/${cartId}`);

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-487px)]">
      <ToastContainer />

      <div className="w-full lg:flex justify-center lg:mt-[150px] md:mt-[100px] font-serif hidden">
        <div className="w-[80%]">
          <Table className="bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">#</TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartList.length > 0 ? (
                cartList.map((cart: CartType, index) => {
                  if (cart.product) {
                    return (
                      <CartTableProduct
                        cart={cart}
                        index={index}
                        cartList={cartList}
                        setCartList={setCartList}
                        handleChecked={handleChecked}
                        handleDelete={handleDelete}
                        key={cart.product.slug}
                      />
                    );
                  }

                  if (cart.promo) {
                    return (
                      <CartTablePromo
                        cart={cart}
                        index={index}
                        cartList={cartList}
                        setCartList={setCartList}
                        handleChecked={handleChecked}
                        handleDelete={handleDelete}
                        key={cart.promo.slug}
                      />
                    );
                  }
                })
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

      <div className="w-full block lg:hidden mt-[80px] font-serif">
        <Table className="bg-white" overflow="hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[2%]">#</TableHead>
              <TableHead colSpan={3}>Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartList.length > 0 ? (
              cartList.map((cart: CartType, index) => {
                if (cart.product) {
                  return (
                    <CartMobileTableProduct
                      cart={cart}
                      index={index}
                      cartList={cartList}
                      setCartList={setCartList}
                      handleChecked={handleChecked}
                      handleDelete={handleDelete}
                      key={cart.product.slug}
                    />
                  );
                }

                if (cart.promo) {
                  return (
                    <CartMobileTablePromo
                      cart={cart}
                      index={index}
                      cartList={cartList}
                      setCartList={setCartList}
                      handleChecked={handleChecked}
                      handleDelete={handleDelete}
                      key={cart.promo.slug}
                    />
                  );
                }
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Empty data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CartTotal carts={cartList} />
    </div>
  );
};

export default CartTable;
