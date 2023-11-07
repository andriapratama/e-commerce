import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
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
      { message: "Successfully to get all categories data", data: categories },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
