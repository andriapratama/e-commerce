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
import { CartType } from "@/types/CartType";
import CheckoutTableProduct from "./CheckoutTableProduct";
import CheckoutTablePromo from "./CheckoutTablePromo";
import CheckoutMobileTableProduct from "./CheckoutMobileTableProduct";
import CheckoutMobileTablePromo from "./CheckoutMobileTablePromo";

interface CheckoutTableProps {
  carts?: CartType[];
}

const CheckoutTable: React.FC<CheckoutTableProps> = ({ carts }) => {
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
            {carts ? (
              carts.length > 0 ? (
                carts.map((cart: CartType, index) => {
                  if (cart.product) {
                    return <CheckoutTableProduct cart={cart} key={index} />;
                  }

                  if (cart.promo) {
                    return <CheckoutTablePromo cart={cart} key={index} />;
                  }
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
                carts.map((cart: CartType, index) => {
                  if (cart.product) {
                    return (
                      <CheckoutMobileTableProduct cart={cart} key={index} />
                    );
                  }

                  if (cart.promo) {
                    return <CheckoutMobileTablePromo cart={cart} key={index} />;
                  }
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

export default CheckoutTable;
