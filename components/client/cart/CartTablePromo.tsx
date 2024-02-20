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
import { Button } from "@/components/ui/button";
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

const CartTablePromo: React.FC<Props> = ({
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
        <TableCell className="text-center">
          <Checkbox
            checked={cart.status}
            onCheckedChange={() => handleChecked(index)}
          />
        </TableCell>

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
              disabled={cart.quantity >= totalStock ? true : false}
            >
              +
            </Button>
          </div>
        </TableCell>
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
        <TableCell>
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

export default CartTablePromo;
