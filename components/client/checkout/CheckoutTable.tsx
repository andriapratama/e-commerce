"use client";

import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { CartType } from "@/types/CartType";

interface CheckoutTableProps {
  carts?: CartType[];
}

const CheckoutTable: React.FC<CheckoutTableProps> = ({ carts }) => {
  return (
    <Table className="bg-white rounded-md">
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
            carts.map((cart: CartType, index) => (
              <TableRow key={cart.product.slug}>
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
                <TableCell className="text-center">{cart.quantity}</TableCell>
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Empty data
              </TableCell>
            </TableRow>
          )
        ) : null}
      </TableBody>
    </Table>
  );
};

export default CheckoutTable;
