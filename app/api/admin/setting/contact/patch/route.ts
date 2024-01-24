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
      email: z.string().min(1).email(),
      address: z.string().min(1).min(3),
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

    const { email, address } = response.data;

    await prismadb.setting.update({
      where: {
        id: idParams ? idParams : "",
      },
      data: {
        email,
        address,
      },
    });

    return NextResponse.json(
      { message: "Success to update contact" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SETTING_CONTACT] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
