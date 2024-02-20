import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { CartLocalType } from "@/types/CartType";
import Image from "next/image";

interface Props {
  cart: CartLocalType;
}

const CheckoutLocalMobileTableData: React.FC<Props> = ({ cart }) => {
  return (
    <TableRow key={cart.slug}>
      <TableCell className="flex !px-0 overflow-hidden">
        <div className="w-[30%] flex justify-center">
          <Image
            src={cart.image}
            alt={cart.name}
            width={200}
            height={200}
            className="object-contain h-[80px] w-auto"
          />
        </div>

        <div className="w-[70%] ml-1">
          <div>{cart.name}</div>

          {cart.salePrice > 0 ? (
            <div className="flex mt-2">
              <div className="w-fit text-gray-600">
                {ConvertIDR(cart.price)}
                <div className="border -mt-3 border-black z-20"></div>
              </div>

              <div className="text-red-700">{ConvertIDR(cart.salePrice)}</div>
            </div>
          ) : (
            <div className="mt-2">{ConvertIDR(cart.price)}</div>
          )}

          <div>x{cart.quantity}</div>

          {cart.salePrice > 0 ? (
            <div className="flex mt-2">
              <div className="w-fit text-gray-600">
                {ConvertIDR(cart.price * cart.quantity)}
                <div className="border -mt-3 border-black z-20"></div>
              </div>

              <div className="text-red-700">
                {ConvertIDR(cart.salePrice * cart.quantity)}
              </div>
            </div>
          ) : (
            <div className="mt-2">{ConvertIDR(cart.price * cart.quantity)}</div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CheckoutLocalMobileTableData;
