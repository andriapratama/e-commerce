"use client";

import { CartLocalType } from "@/types/CartType";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface CartContextType {
  carts: CartLocalType[];
  setCarts: Dispatch<SetStateAction<CartLocalType[]>>;
}

export const CartContext = createContext<CartContextType | null>(null);

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const [carts, setCarts] = useState<CartLocalType[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const cartsFromLocal = JSON.parse(
        localStorage.getItem("carts") as string
      );

      setCarts(cartsFromLocal);
    }
  }, []);

  return (
    <CartContext.Provider value={{ carts, setCarts }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Carts is null");
  }

  const carts = context.carts;

  const handleSetCarts = (carts: CartLocalType[]) => {
    context.setCarts(carts);

    localStorage.setItem("carts", JSON.stringify(carts));
  };

  return { carts, handleSetCarts };
};
