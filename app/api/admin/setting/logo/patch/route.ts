import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { DeleteImage } from "@/utils/DeleteImage";
import { UploadImage } from "@/utils/UploadImage";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const url = new URL(req.url);

    const idParams = url.searchParams.get("id");
    const imagePathnameParams = url.searchParams.get("imagePathname");

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
