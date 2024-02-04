import prismadb from "@/lib/prismadb";
import { ProductMinStockType } from "@/types/ProductType";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const res = await prismadb.product.findMany({
      select: {
        name: true,
        image: true,
        totalStock: true,
        slug: true,
        minimumStock: true,
      },
    });

    let products: ProductMinStockType[] = [];

    for (let i = 0; i < res.length; i++) {
      if (res[i].totalStock < res[i].minimumStock) {
        products.push({
          name: res[i].name,
          image: res[i].image,
          totalStock: res[i].totalStock,
          slug: res[i].slug,
        });
      }
    }

    return NextResponse.json(
      { message: "Successfully get products minimum stock", data: products },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCTS_MIN_STOCK] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
