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

    const carts = await prismadb.cart.findMany({
      where: {
        userId: findUser.id,
      },
      select: {
        id: true,
        quantity: true,
        total: true,
        status: true,
        product: {
          select: {
            name: true,
            price: true,
            salePrice: true,
            status: true,
            totalStock: true,
            image: true,
            slug: true,
          },
        },
        promo: {
          select: {
            name: true,
            firstPrice: true,
            promoPrice: true,
            status: true,
            image: true,
            slug: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Successfully got all cart data by user id",
        data: carts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CART_GET_BY_EMAIL]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
