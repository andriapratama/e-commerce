"use client";

import { CartType } from "@/types/CartType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import React, { useEffect, useState } from "react";

interface CheckoutTotalProps {
  carts?: CartType[];
}

const CheckoutTotal: React.FC<CheckoutTotalProps> = ({ carts }) => {
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setSubtotal(0);
    setTax(0);
    setTotal(0);

    if (carts)
      carts.map((cart: CartType) => {
        setSubtotal((prev) => prev + cart.total);
      });

    setTax((subtotal / 100) * 11);

    setTotal(subtotal + tax);
  }, [carts, setSubtotal, setTax, setTotal, subtotal, tax]);
  return (
    <div className="w-full h-fit p-4 font-serif text-gray-600 border rounded-md text-sm">
      <div className="text-lg font-semibold">Cart Total</div>
      <div className="w-full flex justify-between mt-3 px-1">
        <div>Subtotal</div>
        <div>{ConvertIDR(subtotal || 0)}</div>
      </div>

      <div className="w-full flex justify-between mt-2 pb-2 border-b px-1">
        <div>{"Tax (11%)"}</div>
        <div>{ConvertIDR(tax || 0)}</div>
      </div>

      <div className="w-full flex justify-between mt-3 px-1">
        <div>TOTAL</div>
        <div className="font-semibold">{ConvertIDR(total || 0)}</div>
      </div>

      <div className="text-xs font-semibold mt-4">
        Total does not include shipping costs
      </div>
    </div>
  );
};

export default CheckoutTotal;
