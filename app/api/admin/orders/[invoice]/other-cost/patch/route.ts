import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const PATCH = async (
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
        { message: "Params is required" },
        { status: 400 }
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

    const body = await req.json();

    const schema = z.object({
      shipping: z.number(),
      discount: z.number(),
    });

    const response = schema.safeParse(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        {
          message: "Invalid request",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { shipping, discount } = response.data;

    const subTotal = findOrder.subTotal ? findOrder.subTotal : 0;
    const tax = findOrder.tax ? findOrder.tax : 0;

    const grandTotal = subTotal + tax + shipping - discount;

    await prismadb.order.update({
      where: {
        invoice: params.invoice,
      },
      data: {
        shipping,
        discount,
        grandTotal,
      },
    });

    return NextResponse.json(
      { message: "Other cost updated" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[ORDER_DETAIL_PATCH] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
