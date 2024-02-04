import { _months } from "@/constant/month";
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
    const typeParams = url.searchParams.get("type");
    const dateParams = url.searchParams.get("date");
    const monthParams = url.searchParams.get("month");
    const yearParams = url.searchParams.get("year");
    const productPageParams = url.searchParams.get("product-page");

    let gte: string = "";
    let lte: string = "";

    if (typeParams === "yearly") {
      gte = yearParams ? `${yearParams}-01-01` : "";
      lte = yearParams ? `${parseInt(yearParams) + 1}-01-01` : "";
    } else if (typeParams === "monthly") {
      const index = _months.findIndex((month) => month === monthParams);

      const month = index + 1;

      const year = yearParams ? yearParams : "";

      if (month === 12) {
        gte = monthParams ? `${year}-${month}-01` : "";
        lte = monthParams ? `${parseInt(year) + 1}-01-01` : "";
      } else {
        gte = monthParams ? `${year}-${month}-01` : "";
        lte = monthParams ? `${year}-${month + 1}-01` : "";
      }
    } else {
      const day = new Date(dateParams ? `${dateParams}` : "");

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      gte = dateParams ? `${dateParams}` : "";
      lte = `${nextDay}`;
    }

    const totalTransaction = await prismadb.order.count({
      where: {
        createdAt: {
          gte: new Date(gte),
          lte: new Date(lte),
        },
      },
    });

    let totalSales: { sales: number; profit: number } = { sales: 0, profit: 0 };

    const resTotalSales = await prismadb.totalSales.findMany({
      where: {
        createdAt: {
          gte: new Date(gte),
          lte: new Date(lte),
        },
      },
    });

    for (let i = 0; i < resTotalSales.length; i++) {
      totalSales.sales += resTotalSales[i].sales;
      totalSales.profit += resTotalSales[i].profit;
    }

    const page = parseInt(productPageParams ? productPageParams : "1");

    const take: number = 10;

    const skip: number = (page - 1) * take;

    let products = [];

    const totalProductSold = await prismadb.productSoldLog.groupBy({
      by: ["productId"],
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: new Date(gte),
          lte: new Date(lte),
        },
      },
      orderBy: {
        _sum: {
          total: "desc",
        },
      },
      take,
      skip,
    });

    for (let i = 0; i < totalProductSold.length; i++) {
      const findProducts = await prismadb.product.findUnique({
        where: {
          id: totalProductSold[i].productId,
        },
        select: {
          name: true,
          image: true,
          slug: true,
        },
      });

      products.push({
        name: findProducts?.name,
        image: findProducts?.image,
        slug: findProducts?.slug,
        total: totalProductSold[i]._sum,
      });
    }

    const countTotalProductSold = await prismadb.productSoldLog.groupBy({
      by: ["productId"],
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: new Date(gte),
          lte: new Date(lte),
        },
      },
    });

    return NextResponse.json({
      message: "Success to get dashboard data",
      data: {
        totalSales,
        totalProductSold: products,
        totalTransaction,
        countTotalProductSold: Math.ceil(countTotalProductSold.length / take),
      },
    });
  } catch (error) {
    console.log("[DASHBOARD_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
