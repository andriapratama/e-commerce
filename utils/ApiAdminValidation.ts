import prismadb from "@/lib/prismadb";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

interface ValidationType {
  error: boolean;
  message: string;
  status: number | undefined;
}

export const ApiAdminValidation = async () => {
  let validation: ValidationType = {
    error: false,
    message: "",
    status: undefined,
  };

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    (validation.error = true),
      (validation.message = "You not login"),
      (validation.status = 401);
  }

  if (session?.user) {
    const username = session.user.username;

    const findEmployee = await prismadb.employee.findUnique({
      where: {
        username,
      },
    });

    if (!findEmployee) {
      (validation.error = true),
        (validation.message = "Employee is not found"),
        (validation.status = 404);
    }

    return { validation, findEmployee };
  }

  return { validation };
};
