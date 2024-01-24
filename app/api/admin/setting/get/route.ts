import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const res = await prismadb.setting.findFirst();

    return NextResponse.json(
      { message: "Success to get setting data", data: res },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SETTING_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
