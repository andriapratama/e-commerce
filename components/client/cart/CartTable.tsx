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
    <React.Fragment>
      <ToastContainer />

      <div className="w-full flex justify-center lg:mt-[150px] md:mt-[100px] mt-[80px] font-serif">
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

      <CartTotal carts={cartList} />
    </React.Fragment>
  );
};

export default CartTable;
