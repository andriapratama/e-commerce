import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (
  req: Request,
  { params }: { params: { username: string } }
) => {
  try {
    if (!params.username) {
      return new NextResponse("Employee username is required", { status: 400 });
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

    const findEmployee = await prismadb.employee.findUnique({
      where: {
        username: params.username,
      },
    });

    if (!findEmployee) {
      return NextResponse.json(
        {
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    const { name, username, role } = response.data;

    const findUsername = await prismadb.employee.findUnique({
      where: {
        username: username,
      },
    });

    if (findUsername) {
      if (findUsername?.id !== findEmployee.id) {
        return NextResponse.json(
          {
            message: "Username sudah digunakan",
          },
          { status: 400 }
        );
      }
    }

    const employee = await prismadb.employee.update({
      where: {
        username: params.username,
      },
      data: {
        name: name,
        username: username,
        role: role,
      },
    });

    return NextResponse.json(
      {
        message: "Employee successfully saved!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[EMPLOYEE_PATCH]", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
