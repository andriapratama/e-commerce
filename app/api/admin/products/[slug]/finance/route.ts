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

    const financeLog = await prismadb.productFinanceLog.findMany({
      where: {
        productId: product.id,
      },
      select: {
        price: true,
        cost: true,
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
        message: "Successfully to get all finance log by product slug",
        data: financeLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[FINANCE_LOG_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
