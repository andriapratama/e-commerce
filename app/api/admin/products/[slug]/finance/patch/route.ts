import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const PATCH = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const { validation, findEmployee } = await ApiAdminValidation();

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
      price: z.number().min(1).min(3),
      cost: z.number().min(1).min(3),
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

    const { price, cost, note } = response.data;

    const findProduct = await prismadb.product.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
      },
    });

    if (!findProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 400 }
      );
    }

    await prismadb.product.update({
      where: {
        slug: params.slug,
      },
      data: {
        price,
        cost,
      },
    });

    if (findEmployee) {
      await prismadb.productFinanceLog.create({
        data: {
          price,
          cost,
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
