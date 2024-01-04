import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { DeleteImage } from "@/utils/DeleteImage";

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    if (!params.id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 });
    }

    const findHero = await prismadb.hero.findMany();

    if (!findHero) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    const findOneHero = findHero.filter((hero) => hero.id === params.id);

    const heroImagePathname = findOneHero[0].imagePathname;

    await prismadb.hero.delete({
      where: {
        id: params.id,
      },
    });

    for (let i = 0; i < findHero.length; i++) {
      if (findHero[i].position > findOneHero[0].position) {
        await prismadb.hero.update({
          where: {
            id: findHero[i].id,
          },
          data: {
            position: findHero[i].position - 1,
          },
        });
      }
    }

    await DeleteImage(heroImagePathname);

    return NextResponse.json({ message: "Heros is deleted" }, { status: 200 });
  } catch (error) {
    console.log("[HERO_DELETE] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
