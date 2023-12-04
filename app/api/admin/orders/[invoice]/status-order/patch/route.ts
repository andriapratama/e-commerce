import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { invoice: string } }
) => {
  try {
    const { validation, findEmployee } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const findOrder = await prismadb.order.findUnique({
      where: {
        invoice: params.invoice,
      },
    });

    if (!findOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const findOrderLog = await prismadb.orderLog.findFirst({
      where: {
        orderId: findOrder.id,
        status: "open",
      },
    });

    if (findOrderLog) {
      return NextResponse.json(
        { message: "Order log is saved" },
        { status: 200 }
      );
    }

    await prismadb.orderLog.create({
      data: {
        status: "open",
        employeeName: findEmployee?.name,
        employeeId: findEmployee?.id,
        orderId: findOrder.id,
      },
    });

    await prismadb.order.update({
      where: {
        invoice: params.invoice,
      },
      data: {
        statusOrder: "ongoing",
        employeeName: findEmployee?.name,
        employeeId: findEmployee?.id,
      },
    });

    return NextResponse.json(
      { message: "Status order changed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STATUS_ORDER_PATCH] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
