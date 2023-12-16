import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const body = await req.json();

    const schema = z.object({
      firstPosition: z.number().min(1),
      secondPosition: z.number().min(1),
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

    const { firstPosition, secondPosition } = response.data;

    const findHero = await prismadb.hero.findMany();

    const firstHero = findHero.filter(
      (hero) => hero.position === firstPosition
    );
    const secondHero = findHero.filter(
      (hero) => hero.position === secondPosition
    );

    await prismadb.hero.update({
      where: {
        id: firstHero[0].id,
      },
      data: {
        position: secondPosition,
      },
    });

    await prismadb.hero.update({
      where: {
        id: secondHero[0].id,
      },
      data: {
        position: firstPosition,
      },
    });

    return NextResponse.json(
      { message: "Hero position is changed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[HERO_PATCH] " + error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
