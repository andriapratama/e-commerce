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
import axios from "axios";

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
  const handleDecrease = () => {
    const thisCarts = [...cartList];

    if (thisCarts[index].quantity <= 1 || !thisCarts[index].quantity) {
      thisCarts[index].quantity = 1;
    } else {
      thisCarts[index].quantity = thisCarts[index].quantity - 1;
    }

    setCartList(thisCarts);

    handleTotal(thisCarts[index].quantity);

    handleUpdate(thisCarts[index].id, thisCarts[index].quantity);
  };

  const handleSetQuantity = (quantity: number) => {
    const thisCarts = [...cartList];

    const total = thisCarts[index].product?.totalStock;

    const thisTotal = total ? total : 0;

    if (quantity >= thisTotal) {
      thisCarts[index].quantity = thisTotal;
    } else if (quantity <= 1 || !quantity) {
      thisCarts[index].quantity = 1;
    } else {
      thisCarts[index].quantity = quantity;
    }

    setCartList(thisCarts);

    handleTotal(thisCarts[index].quantity);

    handleUpdate(thisCarts[index].id, thisCarts[index].quantity);
  };

  const handleIncrease = () => {
    const thisCarts = [...cartList];

    const total = thisCarts[index].product?.totalStock;

    const thisTotal = total ? total : 0;

    if (thisCarts[index].quantity >= thisTotal) {
      thisCarts[index].quantity = thisTotal;
    } else {
      thisCarts[index].quantity = thisCarts[index].quantity + 1;
    }

    setCartList(thisCarts);

    handleTotal(thisCarts[index].quantity);

    handleUpdate(thisCarts[index].id, thisCarts[index].quantity);
  };

  const handleTotal = (quantity: number) => {
    const thisCarts = [...cartList];

    const price = thisCarts[index].product?.price;

    const saleprice = thisCarts[index].product?.salePrice;

    const status = thisCarts[index].product?.status;

    const thisPrice = price ? price : 0;

    const thisSalePrice = saleprice ? saleprice : 0;

    const total =
      status === "sale" ? thisSalePrice * quantity : thisPrice * quantity;

    thisCarts[index].total = total;

    setCartList(thisCarts);
  };

  const handleUpdate = async (cartId: string, quantity: number) => {
    await axios.patch("/api/cart/product/patch", {
      cartId,
      quantity,
    });
  };

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
            width={50}
            height={50}
            className="object-contain h-[50px] w-auto"
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
