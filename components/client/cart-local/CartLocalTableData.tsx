"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { CartLocalType } from "@/types/CartType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { useCartLocalHook } from "@/hooks/client/CartLocalHook";

interface Props {
  index: number;
  cart: CartLocalType;
}

const CartLocalTableData: React.FC<Props> = ({ cart, index }) => {
  const {
    handleDecrease,
    handleIncrease,
    handleSetQuantity,
    handleChecked,
    handleDelete,
  } = useCartLocalHook(index);

  return (
    <TableRow key={cart.slug}>
      <TableCell className="text-center">
        <Checkbox
          checked={cart.status}
          onCheckedChange={() => handleChecked()}
        />
      </TableCell>

      <TableCell className="flex justify-center items-center">
        <Image
          src={cart.image}
          alt={cart.name}
          width={200}
          height={200}
          className="object-contain h-[60px] w-auto"
        />
      </TableCell>
      <TableCell className="capitalize">{cart.name}</TableCell>
      <TableCell>
        {cart.salePrice > 0 ? (
          <div className="block">
            <div className="w-fit text-gray-600">
              {ConvertIDR(cart.price)}
              <div className="border -mt-3 border-black z-20"></div>
            </div>

            <div className="mt-3 text-red-700">
              {ConvertIDR(cart.salePrice)}
            </div>
          </div>
        ) : (
          ConvertIDR(cart.price)
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleDecrease();
            }}
            disabled={cart.quantity <= 1 ? true : false}
          >
            -
          </Button>
          <Input
            type="text"
            className="text-center w-[100px] h-9"
            value={cart.quantity}
            onChange={(e) => handleSetQuantity(parseInt(e.target.value))}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIncrease()}
            disabled={cart.quantity >= cart.totalStock ? true : false}
          >
            +
          </Button>
        </div>
      </TableCell>
      <TableCell>
        {cart.salePrice > 0 ? (
          <div className="block">
            <div className="w-fit text-gray-600">
              {ConvertIDR(cart.price * cart.quantity)}
              <div className="border -mt-3 border-black z-20"></div>
            </div>

            <div className="mt-3 text-red-700">
              {ConvertIDR(cart.salePrice * cart.quantity)}
            </div>
          </div>
        ) : (
          ConvertIDR(cart.price * cart.quantity)
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center">
          <Trash2
            className="text-red-500 cursor-pointer"
            width={18}
            height={18}
            onClick={() => handleDelete()}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CartLocalTableData;
