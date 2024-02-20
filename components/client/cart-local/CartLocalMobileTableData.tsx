import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { CartLocalType } from "@/types/CartType";
import { useCartLocalHook } from "@/hooks/client/CartLocalHook";

interface Props {
  index: number;
  cart: CartLocalType;
}

const CartLocalMobileTableData: React.FC<Props> = ({ cart, index }) => {
  const {
    handleDecrease,
    handleIncrease,
    handleSetQuantity,
    handleChecked,
    handleDelete,
  } = useCartLocalHook(index);

  return (
    <TableRow key={cart.slug}>
      <TableCell className="text-center !pl-1">
        <Checkbox
          checked={cart.status}
          onCheckedChange={() => handleChecked()}
        />
      </TableCell>
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
              disabled={cart.quantity >= cart.totalStock ? true : false}
            >
              +
            </button>
          </div>

          {cart.salePrice > 0 ? (
            <div className="flex mt-2">
              <div className="w-fit text-gray-600">
                {ConvertIDR(cart.price * cart.quantity)}
                <div className="border -mt-3 border-black z-20" />
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
      <TableCell className="!pl-0 !pr-2">
        <div className="flex items-center justify-center">
          <Trash2
            className="text-red-500 cursor-pointer"
            width={18}
            height={18}
            onClick={() => handleDelete()}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CartLocalMobileTableData;
