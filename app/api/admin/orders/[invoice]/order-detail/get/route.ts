import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { invoice: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation();

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

    const order = await prismadb.order.findUnique({
      where: {
        invoice: params.invoice,
      },
      select: {
        invoice: true,
        statusOrder: true,
        paymentMethod: true,
        statuspayment: true,
        totalItem: true,
        subTotal: true,
        shipping: true,
        grandTotal: true,
        discount: true,
        tax: true,
        note: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            address: true,
            phone: true,
          },
        },
        employeeName: true,
        orderDetail: {
          select: {
            name: true,
            price: true,
            quantity: true,
            total: true,
            product: {
              select: {
                image: true,
              },
            },
          },
        },
        orderLog: {
          select: {
            status: true,
            employeeName: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Successfully to get order detail by invoice", data: order },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ORDER_DETAIL_BY_INVOICE] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
