import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (
  req: Request,
  { params }: { params: { username: string; slug: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation(params.username);

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    if (!params.slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const schema = z.object({
      stock: z.number().min(1).min(3),
      status: z.string().min(1),
      note: z.string().optional(),
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

    const { stock, status, note } = response.data;

    const findProduct = await prismadb.product.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
        totalStock: true,
      },
    });

    if (!findProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 400 }
      );
    }

    const findEmployee = await prismadb.employee.findUnique({
      where: {
        username: params.username,
      },
      select: {
        id: true,
      },
    });

    await prismadb.product.update({
      where: {
        slug: params.slug,
      },
      data: {
        totalStock:
          status === "increase" ? findProduct.totalStock + stock : stock,
      },
    });

    if (findEmployee) {
      await prismadb.productStockLog.create({
        data: {
          previousStock: findProduct.totalStock,
          stock,
          stockNow:
            status === "increase" ? findProduct.totalStock + stock : stock,
          status: status === "increase" ? "increase" : "update",
          note,
          productId: findProduct.id,
          employeeId: findEmployee.id,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Finance successfully updated!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[FINANCE_UPDATE_BY_SLUG]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
