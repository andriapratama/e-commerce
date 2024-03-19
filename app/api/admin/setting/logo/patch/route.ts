import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { DeleteImage } from "@/utils/DeleteImage";
import { UploadImage } from "@/utils/UploadImage";

export const PATCH = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const idParams = searchParams.get("id");
  const imagePathnameParams = searchParams.get("imagePathname");

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

    await prismadb.setting.update({
      where: {
        id: idParams ? idParams : "",
      },
      data: {
        image: imageLink,
        imagePathname: imagePathname,
      },
    });

    if (imagePathnameParams) {
      await DeleteImage(imagePathnameParams);
    }

    return NextResponse.json(
      {
        message: "Logo successfully updated!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SETTING_LOGO] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
