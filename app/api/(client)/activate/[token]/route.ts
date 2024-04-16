import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export const GET = async (
  req: Request,
  { params }: { params: { token: string } }
) => {
  let isSuccess = false;

  try {
    if (!params.token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      );
    }

    const findActivateToken = await prismadb.activateToken.findFirst({
      where: {
        activateAt: null,
        token: params.token,
      },
    });

    if (!findActivateToken) {
      isSuccess = false;
      return NextResponse.json(
        { message: "Token is invalid" },
        { status: 404 }
      );
    }

    await prismadb.user.update({
      where: {
        id: findActivateToken.userId,
      },
      data: {
        active: true,
      },
    });

    await prismadb.activateToken.update({
      where: {
        token: params.token,
      },
      data: {
        activateAt: new Date(),
      },
    });

    isSuccess = true;
  } catch (error) {
    console.log("[ACTIVATE_TOKEN_GET]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    if (isSuccess === true) {
      return redirect("/login");
    } else {
      return redirect("/");
    }
  }
};
