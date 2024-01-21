import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const body = await req.json();

    const schema = z.object({
      cartId: z.string().min(1),
      quantity: z.number().min(1),
    });

    const response = schema.safeParse(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        {
          message: "Invalid request",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { cartId, quantity } = response.data;

    const findCart = await prismadb.cart.findUnique({
      where: {
        id: cartId,
      },
      select: {
        id: true,
        promo: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!findCart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    if (!findCart.promo) {
      return null;
    }

    const findPromo = await prismadb.promo.findUnique({
      where: {
        id: findCart.promo.id,
      },
      select: {
        promoPrice: true,
      },
    });

    if (!findPromo) {
      return NextResponse.json({ message: "Promo not found" }, { status: 404 });
    }

    let total = findPromo.promoPrice * quantity;

    await prismadb.cart.update({
      where: {
        id: cartId,
      },
      data: {
        quantity,
        total,
      },
    });

    return NextResponse.json({ message: "Cart updated" }, { status: 200 });
  } catch (error) {
    console.log("[CART_UPDATE]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
