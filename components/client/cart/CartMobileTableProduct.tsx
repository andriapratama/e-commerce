import React, { Dispatch, SetStateAction } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { TableCell, TableRow } from "@/components/ui/table";
import { CartType } from "@/types/CartType";
import { Input } from "@/components/ui/input";
import LoadingGif from "@/components/LoadingGif";
import { Trash2 } from "lucide-react";
import { useCartDetailHook } from "@/hooks/client/CartClientSideHook";

interface Props {
  cart: CartType;
  index: number;
  handleChecked: (index: number) => void;
  handleDelete: (index: number) => void;
  cartList: CartType[];
  setCartList: Dispatch<SetStateAction<CartType[]>>;
}

const CartMobileTableProduct: React.FC<Props> = ({
  cart,
  index,
  cartList,
  setCartList,
  handleChecked,
  handleDelete,
}) => {
  const totalStock = cartList[index].product?.totalStock as number;

  const { handleDecrease, handleSetQuantity, handleIncrease } =
    useCartDetailHook(index, cartList, setCartList, "product", totalStock);

  if (cart.product) {
    return (
      <TableRow key={cart.product.slug}>
        <TableCell className="text-center !pl-1">
          <Checkbox
            checked={cart.status}
            onCheckedChange={() => handleChecked(index)}
          />
        </TableCell>
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
                disabled={
                  cart.quantity >= cart.product.totalStock ? true : false
                }
              >
                +
              </button>
            </div>

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
  } else {
    return null;
  }
};

export default CartMobileTableProduct;
