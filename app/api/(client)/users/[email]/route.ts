import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  let isSuccess = false;
  try {
    if (!params.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prismadb.user.findUnique({
      where: {
        email: params.email,
      },
      select: {
        active: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.active === false) {
      isSuccess = false;
      return NextResponse.json(
        {
          message: "User is not active",
        },
        { status: 400 }
      );
    }

    isSuccess = true;

    return NextResponse.json({ message: "User is active" }, { status: 200 });
  } catch (error) {
    console.log("[USER_GET_BY_EMAIL]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    if (isSuccess === false) {
      return redirect("/announcement");
    }
  }
};
