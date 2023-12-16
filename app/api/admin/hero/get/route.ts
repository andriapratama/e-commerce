import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
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

    const heros = await prismadb.hero.findMany({
      select: {
        id: true,
        image: true,
        position: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    return NextResponse.json(
      { message: "Successfully to get all heros data", data: heros },
      { status: 200 }
    );
  } catch (error) {
    console.log("[HERO_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
