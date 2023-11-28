import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

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
        { status: 404 }
      );
    }

    const stockLog = await prismadb.productStockLog.findMany({
      where: {
        productId: product.id,
      },
      select: {
        previousStock: true,
        stock: true,
        stockNow: true,
        status: true,
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
        message: "Successfully to get all stock log by product slug",
        data: stockLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STOCK_LOG_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
