import axios from "axios";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const PATCH = async (
  req: Request,
  { params }: { params: { username: string; slug: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation(params.username);

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

    const findProduct = await prismadb.product.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
        imagePathname: true,
      },
    });

    if (!findProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 400 }
      );
    }

    const imagePathname = findProduct.imagePathname;

    const data = await req.formData();
    const image: File | null = data.get("image") as unknown as File;

    if (!image) {
      return NextResponse.json({ message: "Image required" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageName = `${Date.now()}-${image.name}`;

    const urlUpload = "https://content.dropboxapi.com/2/files/upload";
    const pathUpload =
      '{"path": "' +
      "/test202310" +
      "/" +
      imageName +
      '","mode": "add","autorename": true,"mute": false}';

    const upload = await axios.post(urlUpload, buffer, {
      headers: {
        Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": pathUpload,
      },
    });

    const pathDisplay = upload.data.path_display;

    if (!pathDisplay) {
      return NextResponse.json(
        { message: "Image failed to upload" },
        { status: 400 }
      );
    }

    const urlGet =
      "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";

    const pathGet =
      '{"path":"' +
      pathDisplay +
      '","settings":{"access":"viewer","allow_download":true,"audience":"public","requested_visibility":"public"}}';

    const getImageLink = await axios.post(urlGet, pathGet, {
      headers: {
        Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const imageLink = getImageLink.data.url;

    await prismadb.product.update({
      where: {
        slug: params.slug,
      },
      data: {
        image: imageLink + "&raw=1",
        imagePathname: pathDisplay,
      },
    });

    const pathDelete = '{"path": "' + imagePathname + '"}';

    const urlDelete = "https://api.dropboxapi.com/2/files/delete_v2";

    await axios.post(urlDelete, pathDelete, {
      headers: {
        Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

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
