"use client";

import React from "react";
import { CartLocalType } from "@/types/CartType";
import { useCartContext } from "@/context/CartContext";
import CheckoutLocalTableData from "./CheckoutLocalTableData";
import CheckoutLocalMobileTableData from "./CheckoutLocalMobileTableData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CheckoutLocalTable = () => {
  const { carts } = useCartContext();

  const filterCarts = carts.filter((cart) => cart.status === true);

  return (
    <React.Fragment>
      <div className="w-full hidden md:block">
        <Table className="bg-white rounded-md ">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterCarts ? (
              filterCarts.length > 0 ? (
                filterCarts.map((cart: CartLocalType, index) => {
                  return <CheckoutLocalTableData cart={cart} key={index} />;
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Empty data
                  </TableCell>
                </TableRow>
              )
            ) : null}
          </TableBody>
        </Table>
      </div>

      <div className="w-full block md:hidden">
        <Table className="bg-white rounded-md ">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carts ? (
              carts.length > 0 ? (
                carts.map((cart: CartLocalType, index) => {
                  return (
                    <CheckoutLocalMobileTableData cart={cart} key={index} />
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center">Empty data</TableCell>
                </TableRow>
              )
            ) : null}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
};

export default CheckoutLocalTable;
