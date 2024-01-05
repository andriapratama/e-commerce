import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { UploadImage } from "@/utils/UploadImage";

export const POST = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const data = await req.formData();

    const image: File | null = data.get("image") as unknown as File;

    if (!image) {
      return NextResponse.json({ message: "Image required" }, { status: 400 });
    }

    const { imageLink, imagePathname } = await UploadImage(image);

    const findHero = await prismadb.hero.findMany();

    let position: number = 0;

    if (!findHero) {
      position = 1;
    } else {
      position = findHero.length + 1;
    }

    await prismadb.hero.create({
      data: {
        image: imageLink,
        imagePathname: imagePathname ? imagePathname : "",
        position,
      },
    });

    return NextResponse.json(
      {
        message: "Hero is created.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("[HERO_POST] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
