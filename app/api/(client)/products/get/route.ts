import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { ClientProductType } from "@/types/ProductType";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const searchValueParams: string | null = searchParams.get("search");
  const pageParams: string | null = searchParams.get("page");
  const categoryParams: string | null = searchParams.get("category");
  const subCategoryParams: string | null = searchParams.get("subCategory");
  const statusParams: string | null = searchParams.get("status");

  try {
    const page: number = parseInt(pageParams ? pageParams : "1");

    let total: number = 0;

    const take: number = 20;

    const skip: number = (page - 1) * take;

    let products: ClientProductType[] = [];

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

    if (categoryParams && subCategoryParams) {
      products = await prismadb.product.findMany({
        where: {
          NOT: {
            status: "archive",
          },
          subCategory: {
            name: subCategoryParams,
          },
        },
        take,
        skip,
        orderBy: {
          name: "asc",
        },
        select,
      });

      total = await prismadb.product.count({
        where: {
          NOT: {
            status: "archive",
          },
          subCategory: {
            name: subCategoryParams,
          },
        },
      });
    } else if (categoryParams) {
      products = await prismadb.product.findMany({
        where: {
          NOT: {
            status: "archive",
          },
          category: {
            name: categoryParams,
          },
        },
        take,
        skip,
        orderBy: {
          name: "asc",
        },
        select,
      });

      total = await prismadb.product.count({
        where: {
          NOT: {
            status: "archive",
          },
          category: {
            name: categoryParams,
          },
        },
      });
    } else if (statusParams) {
      products = await prismadb.product.findMany({
        where: {
          status:
            statusParams === "new"
              ? "new"
              : statusParams === "best"
              ? "best"
              : "sale",
        },
        orderBy: {
          name: "asc",
        },
        select,
      });
    } else if (searchValueParams) {
      products = await prismadb.product.findMany({
        where: {
          NOT: {
            status: "archive",
          },
          OR: [
            {
              name: { contains: searchValueParams },
            },
          ],
        },
        take: 5,
        orderBy: {
          name: "asc",
        },
        select,
      });
    } else if (page > 0) {
      products = await prismadb.product.findMany({
        where: {
          NOT: {
            status: "archive",
          },
        },
        take,
        skip,
        orderBy: {
          name: "asc",
        },
        select,
      });

      total = await prismadb.product.count({
        where: {
          NOT: {
            status: "archive",
          },
        },
      });
    } else {
      products = await prismadb.product.findMany({
        orderBy: {
          name: "asc",
        },
        select,
      });
    }

    return NextResponse.json(
      {
        message: `Successfully to get all product data ${
          searchParams
            ? "by search"
            : categoryParams
            ? "by category name"
            : subCategoryParams
            ? "by sub category name"
            : statusParams
            ? "by status"
            : ""
        }`,
        data: {
          products,
          totalPage: Math.ceil(total / take),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET_CLIENT]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
