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

    const url = new URL(req.url);

    const idParams = url.searchParams.get("id");

    const body = await req.json();

    const schema = z.object({
      whatsapp: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
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

    const { whatsapp, instagram, twitter, facebook } = response.data;

    await prismadb.setting.update({
      where: {
        id: idParams ? idParams : "",
      },
      data: {
        whatsapp,
        instagram,
        twitter,
        facebook,
      },
    });

    return NextResponse.json(
      { message: "Success to update sosmed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SETTING_SOSMED] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
