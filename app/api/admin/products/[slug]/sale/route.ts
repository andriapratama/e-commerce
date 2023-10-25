import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    if (!params.slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const product = await prismadb.product.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 400 }
      );
    }

    const saleLog = await prismadb.productSaleLog.findMany({
      where: {
        productId: product.id,
      },
      select: {
        sale: true,
        salePrice: true,
        note: true,
        createdAt: true,
        employee: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Successfully to get all sale log by product slug",
        data: saleLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STOCK_LOG_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
