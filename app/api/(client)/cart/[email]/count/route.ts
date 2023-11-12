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

    const findUser = await prismadb.user.findUnique({
      where: {
        email: params.email,
        role: "member",
      },
      select: {
        id: true,
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const countCarts = await prismadb.cart.count({
      where: {
        userId: findUser.id,
      },
    });

    return NextResponse.json(
      { message: "Successfully count total cart by email", data: countCarts },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CART_COUNT_BY_EMAIL]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
