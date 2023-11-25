import prismadb from "@/lib/prismadb";

interface ValidationType {
  error: boolean;
  message: string;
  status: number | undefined;
}

export const ApiAdminValidation = async (username: string | undefined) => {
  let validation: ValidationType = {
    error: false,
    message: "",
    status: undefined,
  };

  let findEmployee = null;

  if (username === "undefined") {
    (validation.error = true),
      (validation.message = "Username is required"),
      (validation.status = 400);
  }

  if (username !== "undefined") {
    findEmployee = await prismadb.employee.findUnique({
      where: {
        username,
      },
    });

    if (!findEmployee) {
      (validation.error = true),
        (validation.message = "Employee is not found"),
        (validation.status = 404);
    }
  }

  return { validation };
};
