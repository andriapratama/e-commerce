import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const promo = await prismadb.promo.findUnique({
      where: {
        slug: params?.slug,
      },
      select: {
        promoProductProvision: true,
        promoProductBonus: true,
      },
    });

    let products: { productId: string; quantity: number; stock: number }[] = [];

    if (!promo) {
      return NextResponse.json({ message: "Promo not found" }, { status: 404 });
    }

    const provision = promo.promoProductProvision;

    for (let i = 0; i < provision.length; i++) {
      products.push({
        productId: provision[i].productId,
        quantity: provision[i].quantity,
        stock: 0,
      });
    }

    const bonus = promo.promoProductBonus;

    for (let i = 0; i < bonus.length; i++) {
      const index = products.findIndex(
        (product) => product.productId === bonus[i].productId
      );

      if (index === -1) {
        products.push({
          productId: bonus[i].productId,
          quantity: bonus[i].quantity,
          stock: 0,
        });
      } else {
        products[index].quantity += bonus[i].quantity;
      }
    }

    for (let i = 0; i < products.length; i++) {
      const res = await prismadb.product.findUnique({
        where: {
          id: products[i].productId,
        },
        select: {
          totalStock: true,
        },
      });

      if (res) {
        const stock = Math.floor(res.totalStock / products[i].quantity);

        products[i].stock = stock;
      }
    }

    const minStock = Math.min(...products.map((product) => product.stock));

    return NextResponse.json(
      { message: "Successfully to get promo product", data: minStock },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PROMO_SLUG_STOCK] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
