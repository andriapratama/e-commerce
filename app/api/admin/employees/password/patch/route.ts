import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prismadb from "@/lib/prismadb";

export const PATCH = async (req: Request) => {
  try {
    const { validation, findEmployee, usernameSession } =
      await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const schema = z.object({
      oldPassword: z.string().min(1).min(6),
      newPassword: z.string().min(1).min(6),
    });

    const body = await req.json();

    const response = schema.safeParse(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        {
          message: "Invalid request",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { oldPassword, newPassword } = response.data;

    const checkOldPassword = await bcrypt.compare(
      oldPassword,
      findEmployee ? findEmployee.password : ""
    );

    if (!checkOldPassword) {
      return NextResponse.json(
        { message: "Password lama salah" },
        { status: 400 }
      );
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);

    await prismadb.employee.update({
      where: {
        username: usernameSession,
      },
      data: {
        password: passwordHash,
      },
    });

    return NextResponse.json(
      { message: "Password is changed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[EMPLOYEE_CHANGE_PASSWORD] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
