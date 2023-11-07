import prismadb from "@/lib/prismadb";
import { ClientProductType } from "@/types/ProductType";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const status = ["sale", "new", "best", "active"];
    let products: ClientProductType[] = [];

    for (let i = 0; i < status.length; i++) {
      const res = await prismadb.product.findMany({
        where: {
          status:
            status[i] === "sale"
              ? "sale"
              : status[i] === "new"
              ? "new"
              : status[i] === "best"
              ? "best"
              : "active",
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

      res.map((value) => {
        products.push(value);
      });
    }

    const productsLimit = products.slice(0, 9);

    return NextResponse.json(
      {
        message: "Success to get all special data product",
        data: productsLimit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
