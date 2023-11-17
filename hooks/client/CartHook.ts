import { authOptions } from "@/lib/auth";
import { CartType } from "@/types/CartType";
import axios from "axios";
import { getServerSession } from "next-auth";

export const useCountCartsHook = async () => {
  const session = await getServerSession(authOptions);

  const resCountCarts = await axios.get(
    `${process.env.WEB_URL}/api/cart/${session?.user.email}/count`
  );

  const countCarts: number = resCountCarts.data.data;

  return { countCarts };
};

export const useGetAllCartsByEmail = async () => {
  const session = await getServerSession(authOptions);

  const resCarts = await axios.get(
    `${process.env.WEB_URL}/api/cart/${session?.user.email}`
  );

  const carts: CartType[] = resCarts.data.data;

  return { carts };
};
