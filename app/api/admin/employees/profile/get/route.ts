import { NextResponse } from "next/server";

import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { validation, findEmployee } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    return NextResponse.json(
      { message: "Successfully to get employee data", data: findEmployee },
      { status: 200 }
    );
  } catch (error) {
    console.log("[EMPLOYEES_USERNAME_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
