import { NextResponse } from "next/server";
import { z } from "zod";

import prismadb from "@/lib/prismadb";

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
        product: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!findCart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    if (!findCart.product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const findProduct = await prismadb.product.findUnique({
      where: {
        id: findCart.product.id,
      },
      select: {
        price: true,
        salePrice: true,
        status: true,
        totalStock: true,
      },
    });

    if (!findProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 400 }
      );
    }

    const status = findProduct.status;

    let total = 0;
    if (status === "sale") {
      if (quantity >= findProduct.totalStock) {
        total = findProduct.salePrice * findProduct.totalStock;
      } else if (quantity <= 0) {
        total = findProduct.salePrice * 0;
      } else {
        total = findProduct.salePrice * quantity;
      }
    } else {
      if (quantity >= findProduct.totalStock) {
        total = findProduct.price * findProduct.totalStock;
      } else if (quantity <= 0) {
        total = findProduct.price * 0;
      } else {
        total = findProduct.price * quantity;
      }
    }

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
