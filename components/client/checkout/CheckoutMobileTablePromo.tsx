import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { CartType } from "@/types/CartType";
import Image from "next/image";

interface Props {
  cart: CartType;
}

const CheckoutMobileTablePromo: React.FC<Props> = ({ cart }) => {
  if (cart.promo) {
    return (
      <TableRow key={cart.promo.slug}>
        <TableCell className="flex !px-0 overflow-hidden">
          <div className="w-[30%] flex justify-center">
            <Image
              src={cart.promo.image}
              alt={cart.promo.name}
              width={300}
              height={200}
              className="object-contain h-[80px] w-auto"
            />
          </div>

          <div className="w-[70%] ml-1">
            <div>{cart.promo.name}</div>

            <div className="flex mt-2">
              <div className="w-fit text-gray-600">
                {ConvertIDR(cart.promo.firstPrice)}
                <div className="border -mt-3 border-black z-20"></div>
              </div>

              <div className="text-red-700">
                {ConvertIDR(cart.promo.promoPrice)}
              </div>
            </div>

            <div>x{cart.quantity}</div>

            <div className="flex mt-2">
              <div className="w-fit text-gray-600">
                {ConvertIDR(cart.promo.firstPrice * cart.quantity)}
                <div className="border -mt-3 border-black z-20"></div>
              </div>

              <div className="text-red-700">
                {ConvertIDR(cart.promo.promoPrice * cart.quantity)}
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
};

export default CheckoutMobileTablePromo;
