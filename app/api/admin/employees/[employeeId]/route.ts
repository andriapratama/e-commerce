import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (
  req: Request,
  { params }: { params: { employeeId: string } }
) => {
  try {
    if (!params.employeeId) {
      return new NextResponse("Employee id is required", { status: 400 });
    }

    const body = await req.json();

    const schema = z.object({
      name: z.string().min(3),
      username: z.string().min(3),
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

    const { name, username, role } = response.data;

    const findUsername = await prismadb.employee.findFirst({
      where: {
        username: username,
      },
    });

    if (findUsername?.id !== params.employeeId) {
      return NextResponse.json(
        {
          message: "Username sudah digunakan",
        },
        { status: 400 }
      );
    }

    const employee = await prismadb.employee.update({
      where: {
        id: params.employeeId,
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
        data: employee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[EMPLOYEE_PATCH]", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
