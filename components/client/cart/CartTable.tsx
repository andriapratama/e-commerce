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
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { CartType } from "@/types/CartType";

interface CartTableProps {
  carts?: CartType[];
}

const CartTable: React.FC<CartTableProps> = ({ carts }) => {
  const handleSetQuantity = (quantity: number) => {
    console.log(quantity);
  };
  return (
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
            {carts ? (
              carts.length > 0 ? (
                carts.map((cart: CartType) => (
                  <TableRow key={cart.product.slug}>
                    <TableCell className="text-center">
                      <input type="checkbox" />
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
                    <TableCell>{ConvertIDR(cart.product.price)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        <Button variant="outline" size="sm">
                          -
                        </Button>
                        <Input
                          type="text"
                          className="text-center w-[100px] h-9"
                          value={cart.quantity}
                          onChange={(e) =>
                            handleSetQuantity(parseInt(e.target.value))
                          }
                        />
                        <Button variant="outline" size="sm">
                          +
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{ConvertIDR(cart.total)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Trash2
                          className="text-red-500 cursor-pointer"
                          width={18}
                          height={18}
                        />
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
              )
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
  );
};

export default CartTable;
