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

    const orders = await prismadb.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
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
      },
    });

    if (!orders) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Successfully get all data orders", data: orders },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ORDERS_GET]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
