// import prismadb from "@/lib/prismadb";
// import { authOptions } from "@/lib/auth";
// import { getServerSession } from "next-auth";

import prismadb from "@/lib/prismadb";

// interface ValidationType {
//   error: boolean;
//   message: string;
//   status: number | undefined;
// }

// export const ApiAdminValidation = async () => {
//   let validation: ValidationType = {
//     error: false,
//     message: "",
//     status: undefined,
//   };

//   const session = await getServerSession(authOptions);

//   if (!session || !session.user) {
//     (validation.error = true),
//       (validation.message = "You not login"),
//       (validation.status = 401);
//   }

//   if (session?.user) {
//     const usernameSession = session.user.username;

//     const findEmployee = await prismadb.employee.findUnique({
//       where: {
//         username: usernameSession,
//       },
//     });

//     if (!findEmployee) {
//       (validation.error = true),
//         (validation.message = "Employee is not found"),
//         (validation.status = 404);
//     }

//     return { validation, findEmployee, usernameSession };
//   }

//   return { validation };
// };
export const ApiAdminValidation = async () => {
  const validation = {
    error: false,
    message: "",
    status: undefined,
  };

  const findEmployee = await prismadb.employee.findFirst({
    where: {
      role: "superAdmin",
    },
  });

  const usernameSession = findEmployee?.username;

  return { validation, findEmployee, usernameSession };
};
