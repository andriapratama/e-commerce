import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const POST = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.error },
        { status: validation.status }
      );
    }

    const body = await req.json();

    const schema = z.object({
      name: z.string().min(3),
      username: z.string().min(3),
      role: z.enum(["superAdmin", "admin"]),
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

    const { name, username, role } = response.data;

    const findUsername = await prismadb.employee.findFirst({
      where: {
        username: username,
      },
    });

    if (findUsername) {
      return NextResponse.json(
        {
          message: "Username sudah digunakan",
        },
        { status: 400 }
      );
    }

    const password = Math.floor(100000 + Math.random() * 900000);

    const passwordHash = bcrypt.hashSync(password.toString(), 10);

    const employee = await prismadb.employee.create({
      data: {
        name: name,
        username: username,
        password: passwordHash,
        role: role,
      },
    });

    return NextResponse.json(
      {
        message: "Employee successfully saved!",
        data: {
          name: employee.name,
          username: employee.username,
          password,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("[EMPLOYEE_POST]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
