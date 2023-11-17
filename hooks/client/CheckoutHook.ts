import { authOptions } from "@/lib/auth";
import { CartType } from "@/types/CartType";
import axios from "axios";
import { getServerSession } from "next-auth";

export const useGetAllDataCheckoutByEmail = async () => {
  const session = await getServerSession(authOptions);

  const resCarts = await axios.get(
    `${process.env.WEB_URL}/api/checkout/${session?.user.email}`
  );

  const carts: CartType[] = resCarts.data.data;

  return { carts };
};
