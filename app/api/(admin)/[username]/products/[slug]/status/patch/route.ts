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
      salePrice: z.number().optional(),
      status: z.enum(["new", "active", "best", "sale", "archive"]),
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

    const { salePrice, status, note } = response.data;

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
        { status: 404 }
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
        status,
        salePrice: status === "sale" ? salePrice : 0,
      },
    });

    if (findEmployee) {
      const sale = await prismadb.productStatusLog.create({
        data: {
          status,
          salePrice: status === "sale" ? salePrice : 0,
          note,
          productId: findProduct.id,
          employeeId: findEmployee?.id,
        },
      });

      return NextResponse.json(
        {
          message: "Status product successfully updated!",
          data: {
            sale: sale.status,
            salePrice: sale.salePrice,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("[STATUS_UPDATE_BY_SLUG]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
