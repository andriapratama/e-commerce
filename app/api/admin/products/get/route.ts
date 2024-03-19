import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const resCategory = searchParams.get("category");
  const resSubCategory = searchParams.get("subCategory");
  const resPage = searchParams.get("page");
  const resSearch = searchParams.get("search");

  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const page = parseInt(resPage ? resPage : "0");
    const search = resSearch ? resSearch : "";

    let total: number = 0;

    const take = 10;

    const skip = (page - 1) * take;

    let products = [];

    const select = {
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
      subCategory: {
        select: {
          name: true,
        },
      },
    };

    if (resCategory && resSubCategory) {
      products = await prismadb.product.findMany({
        where: {
          subCategory: {
            name: resSubCategory,
          },
        },
        take,
        skip,
        orderBy: {
          name: "asc",
        },
        select: select,
      });

      total = await prismadb.product.count({
        where: {
          subCategory: {
            name: resSubCategory,
          },
        },
      });
    } else if (resCategory) {
      products = await prismadb.product.findMany({
        where: {
          category: {
            name: resCategory,
          },
        },
        take,
        skip,
        orderBy: {
          name: "asc",
        },
        select: select,
      });

      total = await prismadb.product.count({
        where: {
          category: {
            name: resCategory,
          },
        },
      });
    } else if (page > 0) {
      products = await prismadb.product.findMany({
        take,
        skip,
        orderBy: {
          name: "asc",
        },
        select: select,
      });

      total = await prismadb.product.count();
    } else if (search !== "") {
      products = await prismadb.product.findMany({
        where: {
          OR: [
            {
              name: { contains: search },
            },
          ],
        },
        take,
        orderBy: {
          name: "asc",
        },
        select: select,
      });
    } else {
      products = await prismadb.product.findMany({
        orderBy: {
          name: "asc",
        },
        select: select,
      });
    }

    return NextResponse.json(
      {
        message: "Successfully get all products",
        data: {
          products,
          totalPage: Math.ceil(total / take),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
