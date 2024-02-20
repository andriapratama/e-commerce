import { CartType } from "@/types/CartType";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useCartHook = (carts?: CartType[]) => {
  const [cartList, setCartList] = useState<CartType[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (carts) {
      let thisCarts: CartType[] = [...carts];

      carts.map((cart, index) => {
        thisCarts[index].isLoading = false;
      });

      setCartList(thisCarts);
    }
  }, [setCartList, carts]);

  const handleDelete = async (index: number) => {
    const thisCarts = [...cartList];

    const cartId = thisCarts[index].id;

    try {
      thisCarts[index].isLoading = true;

      setCartList(thisCarts);

      await axios.delete(`/api/cart/delete/${cartId}`);

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      thisCarts[index].isLoading = false;

      setCartList(thisCarts);
    }
  };

  const handleChecked = async (index: number) => {
    const thisCarts = [...cartList];

    const cartId = thisCarts[index].id;

    thisCarts[index].status = !thisCarts[index].status;

    setCartList(thisCarts);

    try {
      await axios.patch(`/api/cart/check/${cartId}`);

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return { cartList, setCartList, handleDelete, handleChecked };
};

export const useCartDetailHook = (
  index: number,
  cartList: CartType[],
  setCartList: Dispatch<SetStateAction<CartType[]>>,
  status: "product" | "promo",
  totalStock: number
) => {
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

    if (quantity >= totalStock) {
      thisCarts[index].quantity = totalStock;
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

    if (thisCarts[index].quantity >= totalStock) {
      thisCarts[index].quantity = totalStock;
    } else {
      thisCarts[index].quantity = thisCarts[index].quantity + 1;
    }

    setCartList(thisCarts);

    handleTotal(thisCarts[index].quantity);

    handleUpdate(thisCarts[index].id, thisCarts[index].quantity);
  };

  const handleTotal = (quantity: number) => {
    const thisCarts = [...cartList];

    let total = 0;

    if (status === "product") {
      const price = thisCarts[index].product?.price;

      const saleprice = thisCarts[index].product?.salePrice;

      const statusProduct = thisCarts[index].product?.status;

      const thisPrice = price ? price : 0;

      const thisSalePrice = saleprice ? saleprice : 0;

      total =
        statusProduct === "sale"
          ? thisSalePrice * quantity
          : thisPrice * quantity;
    } else {
      const price = thisCarts[index].promo?.promoPrice;

      const thisPrice = price ? price : 0;

      total = thisPrice * quantity;
    }

    thisCarts[index].total = total;

    setCartList(thisCarts);
  };

  const handleUpdate = async (cartId: string, quantity: number) => {
    let route = "";

    if (status === "product") {
      route = "/api/cart/product/patch";
    } else {
      route = "/api/cart/promo/patch";
    }

    await axios.patch(route, {
      cartId,
      quantity,
    });
  };

  return { handleDecrease, handleSetQuantity, handleIncrease };
};
