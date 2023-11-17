import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
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
        role: "member",
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        address: true,
        phone: true,
        active: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Successfully get user by email",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[USER_GET_BY_EMAIL]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
