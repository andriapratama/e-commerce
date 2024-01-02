import prismadb from "@/lib/prismadb";
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

    const url = new URL(req.url);

    const resPage = url.searchParams.get("page");

    const page = parseInt(resPage ? resPage : "0");

    const take = 10;

    const skip = (page - 1) * take;

    let promos = [];

    const select = {
      image: true,
      imagePathname: true,
      name: true,
      slug: true,
      description: true,
      firstPrice: true,
      promoPrice: true,
      status: true,
      createdAt: true,
    };

    if (page > 0) {
      promos = await prismadb.promo.findMany({
        take,
        skip,
        orderBy: {
          createdAt: "desc",
        },
        select: select,
      });
    } else {
      promos = await prismadb.promo.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: select,
      });
    }

    const totalData = await prismadb.product.count();

    const totalPage = Math.ceil(totalData / take);

    return NextResponse.json(
      {
        message: "Successfully get all data promos",
        data: {
          promos,
          totalPage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PROMO_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
