import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { CartType } from "@/types/CartType";
import Image from "next/image";

interface Props {
  cart: CartType;
}

const CheckoutTablePromo: React.FC<Props> = ({ cart }) => {
  if (cart.promo) {
    return (
      <TableRow>
        <TableCell className="flex justify-center items-center">
          <Image
            src={cart.promo.image}
            alt={cart.promo.name}
            width={300}
            height={200}
            className="object-contain h-[60px] w-auto"
          />
        </TableCell>
        <TableCell className="capitalize">{cart.promo.name}</TableCell>
        <TableCell>
          <div className="block">
            <div className="w-fit text-gray-600">
              {ConvertIDR(cart.promo.firstPrice)}
              <div className="border -mt-3 border-black z-20"></div>
            </div>

            <div className="mt-3 text-red-700">
              {ConvertIDR(cart.promo.promoPrice)}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-center">{cart.quantity}</TableCell>
        <TableCell>
          <div className="block">
            <div className="w-fit text-gray-600">
              {ConvertIDR(cart.promo.firstPrice * cart.quantity)}
              <div className="border -mt-3 border-black z-20"></div>
            </div>

            <div className="mt-3 text-red-700">
              {ConvertIDR(cart.promo.promoPrice * cart.quantity)}
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
};

export default CheckoutTablePromo;
