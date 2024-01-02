import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { UploadImage } from "@/utils/UploadImage";
import { DeleteImage } from "@/utils/DeleteImage";

export const PATCH = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    if (!params.slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const findPromo = await prismadb.promo.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
        imagePathname: true,
      },
    });

    if (!findPromo) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 400 }
      );
    }

    const imagePathname = findPromo.imagePathname;

    const data = await req.formData();
    const image: File | null = data.get("image") as unknown as File;

    if (!image) {
      return NextResponse.json({ message: "Image required" }, { status: 400 });
    }

    const { imageUpload, imageLink, pathDisplay } = await UploadImage(image);

    if (imageUpload.error) {
      return NextResponse.json(
        { message: imageUpload.message },
        { status: imageUpload.status }
      );
    }

    await prismadb.promo.update({
      where: {
        slug: params.slug,
      },
      data: {
        image: imageLink + "&raw=1",
        imagePathname: pathDisplay,
      },
    });

    await DeleteImage(imagePathname);

    return NextResponse.json(
      {
        message: "Image successfully updated!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_EDIT_IMAGE", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
