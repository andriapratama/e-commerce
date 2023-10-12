import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const schema = z.object({
      name: z.string().min(3),
      username: z.string().min(3),
      password: z.string().min(6),
      role: z.string().min(1),
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

    const { name, username, password, role } = response.data;

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
    } else {
      const passwordHash = bcrypt.hashSync(password, 10);

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
          data: employee,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("[EMPLOYEE_POST]", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
