import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { CartType } from "@/types/CartType";
import Image from "next/image";

interface Props {
  cart: CartType;
}

const CheckoutMobileTableProduct: React.FC<Props> = ({ cart }) => {
  if (cart.product) {
    return (
      <TableRow key={cart.product.slug}>
        <TableCell className="flex !px-0 overflow-hidden">
          <div className="w-[30%] flex justify-center">
            <Image
              src={cart.product.image}
              alt={cart.product.name}
              width={200}
              height={200}
              className="object-contain h-[80px] w-auto"
            />
          </div>

          <div className="w-[70%] ml-1">
            <div>{cart.product.name}</div>

            {cart.product.status === "sale" ? (
              <div className="flex mt-2">
                <div className="w-fit text-gray-600">
                  {ConvertIDR(cart.product.price)}
                  <div className="border -mt-3 border-black z-20"></div>
                </div>

                <div className="text-red-700">
                  {ConvertIDR(cart.product.salePrice)}
                </div>
              </div>
            ) : (
              <div className="mt-2">{ConvertIDR(cart.product.price)}</div>
            )}

            <div>x{cart.quantity}</div>

            {cart.product.status === "sale" ? (
              <div className="flex mt-2">
                <div className="w-fit text-gray-600">
                  {ConvertIDR(cart.product.price * cart.quantity)}
                  <div className="border -mt-3 border-black z-20"></div>
                </div>

                <div className="text-red-700">
                  {ConvertIDR(cart.product.salePrice * cart.quantity)}
                </div>
              </div>
            ) : (
              <div className="mt-2">{ConvertIDR(cart.total)}</div>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
};

export default CheckoutMobileTableProduct;
