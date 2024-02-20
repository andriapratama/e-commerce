import React, { Dispatch, SetStateAction } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { TableCell, TableRow } from "@/components/ui/table";
import { CartType } from "@/types/CartType";
import { Button } from "@/components/ui/button";
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

const CartTableProduct: React.FC<Props> = ({
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
        <TableCell className="text-center">
          <Checkbox
            checked={cart.status}
            onCheckedChange={() => handleChecked(index)}
          />
        </TableCell>

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
              disabled={cart.quantity >= cart.product.totalStock ? true : false}
            >
              +
            </Button>
          </div>
        </TableCell>
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
  } else {
    return null;
  }
};

export default CartTableProduct;
