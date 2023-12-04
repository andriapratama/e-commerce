import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

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

    if (!params.invoice) {
      return NextResponse.json(
        { message: "Invoice is required" },
        { status: 400 }
      );
    }

    const findOrder = await prismadb.order.findUnique({
      where: {
        invoice: params.invoice,
      },
    });

    if (!findOrder) {
      return NextResponse.json(
        { message: "Order is not found" },
        { status: 404 }
      );
    }

    await prismadb.order.update({
      where: {
        invoice: params.invoice,
      },
      data: {
        statuspayment: "paid",
      },
    });

    await prismadb.orderLog.create({
      data: {
        status: "paid",
        employeeName: findEmployee?.name,
        orderId: findOrder.id,
        employeeId: findEmployee?.id,
      },
    });

    return NextResponse.json(
      { message: "Payment status is changed" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PAYMENT_STATUS_PATCH] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
