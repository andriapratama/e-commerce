import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const hero = await prismadb.hero.findMany({
      orderBy: {
        position: "asc",
      },
      select: {
        image: true,
        position: true,
      },
    });

    return NextResponse.json(
      { message: "Successfully get all hero data", data: hero },
      { status: 200 }
    );
  } catch (error) {
    console.log("[HERO_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
