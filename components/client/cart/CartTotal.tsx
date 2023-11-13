import ButtonLoading from "@/components/ButtonLoading";
import { Button } from "@/components/ui/button";
import { CartType } from "@/types/CartType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CartTotalProps {
  carts?: CartType[];
}

const CartTotal: React.FC<CartTotalProps> = ({ carts }) => {
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setSubtotal(0);
    setTax(0);
    setTotal(0);

    if (carts) {
      carts.map((cart: CartType) => {
        if (cart.status === true) setSubtotal((prev) => prev + cart.total);
      });
    }

    setTax((subtotal / 100) * 11);

    setTotal(subtotal + tax);

    if (subtotal > 0) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }
  }, [carts, setSubtotal, setTax, subtotal, setTotal, tax, setIsDisable]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-[80%] flex justify-end">
        <div className="block">
          <div className="w-[350px] h-fit p-4 font-serif mt-10 text-gray-600 border rounded-md text-sm">
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
          </div>

          <Button
            className="w-full mt-2"
            disabled={isDisable}
            onClick={() => {
              router.push("/checkout");
              setIsDisable(true);
              setIsLoading(true);
            }}
          >
            {isLoading ? <ButtonLoading /> : "Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
