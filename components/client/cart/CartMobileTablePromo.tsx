"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { TableCell, TableRow } from "@/components/ui/table";
import { CartType } from "@/types/CartType";
import { Input } from "@/components/ui/input";
import LoadingGif from "@/components/LoadingGif";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useCartDetailHook } from "@/hooks/client/CartClientSideHook";

interface Props {
  cart: CartType;
  index: number;
  handleChecked: (index: number) => void;
  handleDelete: (index: number) => void;
  cartList: CartType[];
  setCartList: Dispatch<SetStateAction<CartType[]>>;
}

const CartMobileTablePromo: React.FC<Props> = ({
  cart,
  index,
  cartList,
  setCartList,
  handleChecked,
  handleDelete,
}) => {
  const [totalStock, setTotalStock] = useState<number>(0);

  const getTotalStock = useCallback(async () => {
    try {
      const res = await axios.get(`/api/promo/${cart.promo?.slug}/stock/get`);

      setTotalStock(res.data.data);
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    getTotalStock();
  }, []);

  const { handleDecrease, handleSetQuantity, handleIncrease } =
    useCartDetailHook(index, cartList, setCartList, "promo", totalStock);

  if (cart.promo) {
    return (
      <TableRow key={cart.promo.slug}>
        <TableCell className="text-center !pl-1">
          <Checkbox
            checked={cart.status}
            onCheckedChange={() => handleChecked(index)}
          />
        </TableCell>
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

          <div className="ml-1 w-[70%]">
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

            <div className="flex gap-1 mt-2">
              <button
                type="button"
                className="w-7 h-7 flex justify-center items-center text-lg border rounded"
                onClick={() => {
                  handleDecrease();
                }}
                disabled={cart.quantity <= 1 ? true : false}
              >
                -
              </button>
              <Input
                type="text"
                className="text-center w-[50px] h-7"
                value={cart.quantity}
                onChange={(e) => handleSetQuantity(parseInt(e.target.value))}
              />
              <button
                type="button"
                className="w-7 h-7 flex justify-center items-center text-lg border rounded"
                onClick={() => handleIncrease()}
                disabled={cart.quantity >= totalStock ? true : false}
              >
                +
              </button>
            </div>

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
        <TableCell className="!pl-0 !pr-2">
          <div className="flex items-center justify-center">
            {cart.isLoading ? (
              <LoadingGif />
            ) : (
              <Trash2
                className="text-red-500 cursor-pointer"
                width={18}
                height={18}
                onClick={() => handleDelete(index)}
              />
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }
};

export default CartMobileTablePromo;
