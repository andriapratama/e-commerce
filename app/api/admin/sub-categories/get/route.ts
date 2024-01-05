import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const GET = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const url = new URL(req.url);

    const categoryParams = url.searchParams.get("category");

    let subCategories = [];

    const select = {
      name: true,
      slug: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    };

    if (categoryParams) {
      subCategories = await prismadb.subCategory.findMany({
        where: {
          category: {
            name: categoryParams,
          },
        },
        select,
        orderBy: {
          name: "asc",
        },
      });
    } else {
      subCategories = await prismadb.subCategory.findMany({
        select,
        orderBy: {
          category: {
            name: "asc",
          },
        },
      });
    }

    return NextResponse.json(
      {
        message: `Successfully get all sub categories data ${
          categoryParams ? "by category name" : ""
        }`,
        data: subCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SUB_CATEGORY_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
