import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";

export const useCountCartsHook = async () => {
  const session = await getServerSession(authOptions);

  const resCountCarts = await axios.get(
    `${process.env.WEB_URL}/api/cart/${session?.user.email}/count`
  );

  const countCarts = resCountCarts.data.data;

  return { countCarts };
};
