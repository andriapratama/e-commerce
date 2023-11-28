import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

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
      {
        message: "Successfully get all products",
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
