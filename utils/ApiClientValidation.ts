import prismadb from "@/lib/prismadb";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

interface ValidationType {
  error: boolean;
  message: string;
  status: number | undefined;
}

export const ApiClientValidation = async () => {
  let validation: ValidationType = {
    error: false,
    message: "",
    status: undefined,
  };

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "member") {
    (validation.error = true),
      (validation.message = "You not login"),
      (validation.status = 401);
  }

  const email = session?.user.email;

  const findUser = await prismadb.user.findUnique({
    where: {
      email,
      role: "member",
    },
    select: {
      id: true,
    },
  });

  if (!findUser) {
    (validation.error = true),
      (validation.message = "User is not found"),
      (validation.status = 404);
  }

  return { validation, findUser };
};
