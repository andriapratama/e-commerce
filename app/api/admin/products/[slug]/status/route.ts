import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    if (!params.slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const product = await prismadb.product.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const statusLog = await prismadb.productStatusLog.findMany({
      where: {
        productId: product.id,
      },
      select: {
        status: true,
        salePrice: true,
        note: true,
        createdAt: true,
        employee: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Successfully to get all status log by product slug",
        data: statusLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STATUS_LOG_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: "You are not logged in",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "superAdmin") {
      return NextResponse.json(
        {
          message: "You are not have access",
        },
        { status: 401 }
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

    const username = session.user.username;

    const findEmployee = await prismadb.employee.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    if (!findEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    await prismadb.product.update({
      where: {
        slug: params.slug,
      },
      data: {
        status,
        salePrice: status === "sale" ? salePrice : 0,
      },
    });

    const sale = await prismadb.productStatusLog.create({
      data: {
        status,
        salePrice: status === "sale" ? salePrice : 0,
        note,
        productId: findProduct.id,
        employeeId: findEmployee.id,
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
  } catch (error) {
    console.log("[STATUS_UPDATE_BY_SLUG]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
