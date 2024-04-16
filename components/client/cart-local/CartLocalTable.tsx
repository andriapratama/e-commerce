"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartContext } from "@/context/CartContext";
import { CartLocalType } from "@/types/CartType";

import CartLocalMobileTableData from "./CartLocalMobileTableData";
import CartLocalTableData from "./CartLocalTableData";
import CartLocalTotal from "./CartLocalTotal";

const CartLocalTable = () => {
  const { carts } = useCartContext();

  return (
    <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-487px)]">
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
              {carts.length > 0 ? (
                carts.map((cart: CartLocalType, index) => {
                  return (
                    <CartLocalTableData cart={cart} index={index} key={index} />
                  );
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
              <TableHead colSpan={3} className="text-center">
                Products
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carts.length > 0 ? (
              carts.map((cart: CartLocalType, index) => {
                return (
                  <CartLocalMobileTableData
                    cart={cart}
                    index={index}
                    key={index}
                  />
                );
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

      <CartLocalTotal carts={carts} />
    </div>
  );
};

export default CartLocalTable;
