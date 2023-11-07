import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const products = await prismadb.product.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
        slug: true,
        totalStock: true,
        minimumStock: true,
        price: true,
        cost: true,
        netFill: true,
        status: true,
        linkGojek: true,
        description: true,
        image: true,
        salePrice: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Successfully to get all product data", data: products },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
