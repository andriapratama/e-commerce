import { authOptions } from "@/lib/auth";
import { UserType } from "@/types/UserType";
import axios from "axios";
import { getServerSession } from "next-auth";

export const useGetUserByEmailHook = async () => {
  const session = await getServerSession(authOptions);

  const res = await axios.get(
    `${process.env.WEB_URL}/api/users/${session?.user.email}`
  );

  const user: UserType = res.data.data;

  return { user };
};
