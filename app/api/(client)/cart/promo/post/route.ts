import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiClientValidation } from "@/utils/ApiClientValidation";

export const POST = async (req: Request) => {
  try {
    const { validation, findUser } = await ApiClientValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const body = await req.json();

    const schema = z.object({
      promoSlug: z.string().min(1),
      quantity: z.number().min(1),
    });

    const response = schema.safeParse(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        { message: "Invalid request", errors },
        { status: 400 }
      );
    }

    const { promoSlug, quantity } = response.data;

    const findPromo = await prismadb.promo.findUnique({
      where: {
        slug: promoSlug,
      },
    });

    if (!findPromo) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const findPromoInCart = await prismadb.cart.findFirst({
      where: {
        promoId: findPromo.id,
      },
    });

    const total = findPromo.promoPrice * quantity;

    if (findPromoInCart) {
      await prismadb.cart.update({
        where: {
          id: findPromoInCart.id,
        },
        data: {
          quantity: findPromoInCart.quantity + quantity,
          total: findPromoInCart.total + total,
        },
      });
    } else {
      await prismadb.cart.create({
        data: {
          quantity,
          total,
          promoId: findPromo.id,
          userId: findUser ? findUser.id : "",
        },
      });
    }

    return NextResponse.json(
      { message: "Your promo are saved to your cart" },
      { status: 201 }
    );
  } catch (error) {
    console.log("[CART_PROMO_POST]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
