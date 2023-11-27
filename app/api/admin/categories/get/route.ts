import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

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
