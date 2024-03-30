import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const employees = await prismadb.employee.findMany({
      select: {
        name: true,
        username: true,
        role: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Successfully get all employees data",
        data: employees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[EMPLOYEE_GET]", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
