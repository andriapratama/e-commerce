import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const res = await prismadb.setting.findFirst({
      select: {
        whatsapp: true,
        instagram: true,
        twitter: true,
        facebook: true,
        email: true,
        address: true,
      },
    });

    return NextResponse.json(
      { message: "Success", data: res },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SETTING_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
