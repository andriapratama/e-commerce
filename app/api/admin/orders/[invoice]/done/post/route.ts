import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const POST = async (
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
        { message: "Order is required" },
        { status: 404 }
      );
    }

    await prismadb.orderLog.create({
      data: {
        status: "done",
        employeeName: findEmployee?.name,
        employeeId: findEmployee?.id,
        orderId: findOrder.id,
      },
    });

    return NextResponse.json({ message: "Order is done" }, { status: 201 });
  } catch (error) {
    console.log("[DONE_POST] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
