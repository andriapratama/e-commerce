import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { username: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation(params.username);

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    // if (!params.username) {
    //   return NextResponse.json(
    //     { message: "Username is required" },
    //     { status: 400 }
    //   );
    // }

    // const findEmployee = await prismadb.employee.findUnique({
    //   where: {
    //     username: params.username,
    //   },
    // });

    // if (!findEmployee) {
    //   return NextResponse.json(
    //     { message: "Employee not found" },
    //     { status: 404 }
    //   );
    // }

    const categories = await prismadb.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
        slug: true,
      },
    });

    return NextResponse.json(
      {
        message: "Successfully get all categories data",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
