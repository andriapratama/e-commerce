import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

export const DELETE = async (
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

    await prismadb.cart.delete({
      where: {
        id: cartId,
      },
    });

    return NextResponse.json({ message: "Cart deleted" }, { status: 200 });
  } catch (error) {
    console.log("[CART_DELETE]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
