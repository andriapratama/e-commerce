import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const PATCH = async (req: Request) => {
  try {
    const { validation, usernameSession } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const body = await req.json();

    const schema = z.object({
      name: z.string().min(1).min(3),
      username: z.string().min(1).min(3),
    });

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

    const { name, username } = response.data;

    const findUsername = await prismadb.employee.findUnique({
      where: {
        username: username,
      },
    });

    if (findUsername) {
      if (findUsername.username !== usernameSession) {
        return NextResponse.json(
          { message: "Username sudah digunakan" },
          { status: 400 }
        );
      }
    }

    await prismadb.employee.update({
      where: {
        username: usernameSession,
      },
      data: {
        name,
        username,
      },
    });

    return NextResponse.json(
      { message: "Successfully edit profile" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[EMPLOYEE_PROFILE_PATCH] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
