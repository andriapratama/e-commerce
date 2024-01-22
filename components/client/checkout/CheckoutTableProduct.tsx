import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { CartType } from "@/types/CartType";
import Image from "next/image";

interface Props {
  cart: CartType;
}

const CheckoutTableProduct: React.FC<Props> = ({ cart }) => {
  if (cart.product) {
    return (
      <TableRow>
        <TableCell className="flex justify-center items-center">
          <Image
            src={cart.product.image}
            alt={cart.product.name}
            width={200}
            height={200}
            className="object-contain h-[60px] w-auto"
          />
        </TableCell>
        <TableCell className="capitalize">{cart.product.name}</TableCell>
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
    );
  } else {
    return null;
  }
};

export default CheckoutTableProduct;
