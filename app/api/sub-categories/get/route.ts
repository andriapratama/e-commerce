import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const category = await prismadb.category.findMany({
      select: {
        name: true,
        slug: true,
        subCategories: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Success get category", data: category },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
