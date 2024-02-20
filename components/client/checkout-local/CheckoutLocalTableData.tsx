import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { CartLocalType } from "@/types/CartType";
import Image from "next/image";

interface Props {
  cart: CartLocalType;
}

const CheckoutLocalTableData: React.FC<Props> = ({ cart }) => {
  return (
    <TableRow>
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
      <TableCell className="text-center">{cart.quantity}</TableCell>
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
    </TableRow>
  );
};

export default CheckoutLocalTableData;
