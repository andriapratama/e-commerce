import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const PATCH = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const idParams = searchParams.get("id");

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
      bank: z.string().min(1).min(5).max(40),
      bankName: z.string().min(1).min(5).max(30),
      bankNumber: z.string().min(1).min(10).max(16),
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

    const { bank, bankName, bankNumber } = response.data;

    await prismadb.setting.update({
      where: {
        id: idParams ? idParams : "",
      },
      data: {
        bank,
        bankName,
        bankNumber,
      },
    });

    return NextResponse.json(
      { message: "Success to update contact" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SETTING_BANK] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
