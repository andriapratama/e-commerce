import { useCartContext } from "@/context/CartContext";

export const useCartLocalHook = (index: number) => {
  const { carts, handleSetCarts } = useCartContext();

  const handleChecked = async () => {
    const thisCarts = [...carts];

    thisCarts[index].status = !thisCarts[index].status;

    handleSetCarts(thisCarts);
  };

  const handleDelete = async () => {
    const thisCarts = [...carts];

    thisCarts.splice(index, 1);

    handleSetCarts(thisCarts);
  };

  const handleDecrease = () => {
    const thisCarts = [...carts];

    if (thisCarts[index].quantity <= 1 || !thisCarts[index].quantity) {
      thisCarts[index].quantity = 1;
    } else {
      thisCarts[index].quantity = thisCarts[index].quantity - 1;
    }

    handleSetCarts(thisCarts);
  };

  const handleSetQuantity = (quantity: number) => {
    const thisCarts = [...carts];

    if (quantity >= thisCarts[index].totalStock) {
      thisCarts[index].quantity = thisCarts[index].totalStock;
    } else if (quantity <= 1 || !quantity) {
      thisCarts[index].quantity = 1;
    } else {
      thisCarts[index].quantity = quantity;
    }

    handleSetCarts(thisCarts);
  };

  const handleIncrease = () => {
    const thisCarts = [...carts];

    if (thisCarts[index].quantity >= thisCarts[index].totalStock) {
      thisCarts[index].quantity = thisCarts[index].totalStock;
    } else {
      thisCarts[index].quantity = thisCarts[index].quantity + 1;
    }

    handleSetCarts(thisCarts);
  };

  return {
    handleDecrease,
    handleIncrease,
    handleSetQuantity,
    handleChecked,
    handleDelete,
  };
};
