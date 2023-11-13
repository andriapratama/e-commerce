import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    if (!params.id) {
      return NextResponse.json({ message: "Id is recuired" }, { status: 400 });
    }

    const cartId = params.id;

    const findCart = await prismadb.cart.findUnique({
      where: {
        id: cartId,
      },
    });

    if (!findCart) {
      return NextResponse.json(
        {
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    await prismadb.cart.update({
      where: {
        id: cartId,
      },
      data: {
        status: findCart.status ? false : true,
      },
    });

    return NextResponse.json({ message: "Cart checked" }, { status: 200 });
  } catch (error) {
    console.log("[CART_CHECK]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
