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
      productSlug: z.string().min(1),
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

    const { productSlug, quantity } = response.data;

    const findProduct = await prismadb.product.findUnique({
      where: {
        slug: productSlug,
      },
    });

    if (!findProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const findProductInCart = await prismadb.cart.findFirst({
      where: {
        productId: findProduct.id,
      },
    });

    const total =
      findProduct.status === "sale"
        ? findProduct.salePrice * quantity
        : findProduct.price * quantity;

    if (findProductInCart) {
      await prismadb.cart.update({
        where: {
          id: findProductInCart.id,
        },
        data: {
          quantity: findProductInCart.quantity + quantity,
          total: findProductInCart.total + total,
        },
      });
    } else {
      await prismadb.cart.create({
        data: {
          quantity,
          total,
          productId: findProduct.id,
          userId: findUser ? findUser.id : "",
        },
      });
    }

    return NextResponse.json(
      { message: "Your product are saved to your cart" },
      { status: 201 }
    );
  } catch (error) {
    console.log("[CART_PRODUCT_POST]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
