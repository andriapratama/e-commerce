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
        { status: 400 }
      );
    }

    const stockLog = await prismadb.productStockLog.findMany({
      where: {
        productId: product.id,
      },
      select: {
        previousStock: true,
        stock: true,
        stockNow: true,
        status: true,
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
        message: "Successfully to get all stock log by product slug",
        data: stockLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[STOCK_LOG_GET]", error);
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

    if (session.user.role !== "super admin") {
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
        { status: 400 }
      );
    }

    if (status === "increase") {
      await prismadb.product.update({
        where: {
          slug: params.slug,
        },
        data: {
          totalStock: findProduct.totalStock + stock,
        },
      });

      await prismadb.productStockLog.create({
        data: {
          previousStock: findProduct.totalStock,
          stock,
          stockNow: findProduct.totalStock + stock,
          status,
          note,
          productId: findProduct.id,
          employeeId: findEmployee.id,
        },
      });

      return NextResponse.json(
        {
          message: "Finance successfully updated!",
        },
        { status: 200 }
      );
    } else if (status === "update") {
      await prismadb.product.update({
        where: {
          slug: params.slug,
        },
        data: {
          totalStock: stock,
        },
      });

      await prismadb.productStockLog.create({
        data: {
          previousStock: findProduct.totalStock,
          stock,
          stockNow: stock,
          status,
          note,
          productId: findProduct.id,
          employeeId: findEmployee.id,
        },
      });

      return NextResponse.json(
        {
          message: "Finance successfully updated!",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("[FINANCE_UPDATE_BY_SLUG]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
