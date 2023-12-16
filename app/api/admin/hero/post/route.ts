import axios from "axios";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

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

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageName: string = `${Date.now()}-${image.name}`;

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

    const pathDisplay: string = upload.data.path_display;

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

    const imageLink: string = getImageLink.data.url;

    const findHero = await prismadb.hero.findMany();

    let position: number = 0;

    if (!findHero) {
      position = 1;
    } else {
      position = findHero.length + 1;
    }

    await prismadb.hero.create({
      data: {
        image: imageLink + "&raw=1",
        imagePathname: pathDisplay,
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
