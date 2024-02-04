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
    const searchParams = url.searchParams.get("search");
    const pageParams = url.searchParams.get("page");
    const statusParams = url.searchParams.get("status");

    const page = parseInt(pageParams ? pageParams : "1");

    const take = 20;

    const skip = (page - 1) * take;

    const select = {
      invoice: true,
      statusOrder: true,
      paymentMethod: true,
      statuspayment: true,
      grandTotal: true,
      userName: true,
      userPhone: true,
      userEmail: true,
      totalItem: true,
      createdAt: true,
    };

    let orders = [];

    let total: number = 0;

    if (searchParams) {
      orders = await prismadb.order.findMany({
        where: {
          OR: [
            {
              invoice: { contains: searchParams },
            },
          ],
        },
        take,
        orderBy: {
          invoice: "desc",
        },
        select,
      });
    } else if (statusParams) {
      if (statusParams === "all") {
        orders = await prismadb.order.findMany({
          take,
          skip,
          orderBy: {
            createdAt: "desc",
          },
          select,
        });

        total = await prismadb.order.count();
      } else {
        orders = await prismadb.order.findMany({
          where: {
            statusOrder:
              statusParams === "new"
                ? "new"
                : statusParams === "ongoing"
                ? "ongoing"
                : statusParams === "done"
                ? "done"
                : "cancel",
          },
          take,
          skip,
          orderBy: {
            createdAt: "desc",
          },
          select,
        });

        total = await prismadb.order.count({
          where: {
            statusOrder:
              statusParams === "new"
                ? "new"
                : statusParams === "ongoing"
                ? "ongoing"
                : statusParams === "done"
                ? "done"
                : "cancel",
          },
        });
      }
    } else {
      orders = await prismadb.order.findMany({
        where: {
          statusOrder: { in: ["new", "ongoing"] },
        },
        take,
        skip,
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            statusOrder: "asc",
          },
        ],
        select,
      });

      total = await prismadb.order.count({
        where: {
          statusOrder: { in: ["new", "ongoing"] },
        },
      });
    }

    return NextResponse.json(
      {
        message: "Successfully get all data orders",
        data: {
          orders,
          totalPage: Math.ceil(total / take),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ORDERS_GET]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
