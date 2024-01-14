import prismadb from "@/lib/prismadb";
import { ClientProductType } from "@/types/ProductType";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);

    const searchParams = url.searchParams.get("search");
    const pageParams = url.searchParams.get("page");
    const categoryParams = url.searchParams.get("category");
    const subCategoryParams = url.searchParams.get("subCategory");
    const statusParams = url.searchParams.get("status");

    const page: number = parseInt(pageParams ? pageParams : "0");

    let total: number = 0;

    const take: number = 10;

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
          subCategory: {
            name: subCategoryParams,
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
            name: subCategoryParams,
          },
        },
      });
    } else if (categoryParams) {
      products = await prismadb.product.findMany({
        where: {
          category: {
            name: categoryParams,
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
    } else if (searchParams) {
      products = await prismadb.product.findMany({
        where: {
          OR: [
            {
              name: { contains: searchParams },
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
        take,
        skip,
        orderBy: {
          name: "asc",
        },
        select,
      });

      total = await prismadb.product.count();
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
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
