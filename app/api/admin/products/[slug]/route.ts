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
        name: true,
        slug: true,
        totalStock: true,
        minimumStock: true,
        price: true,
        cost: true,
        netFill: true,
        status: true,
        linkGojek: true,
        description: true,
        image: true,
        sale: true,
        salePrice: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Successfully to get one data by slug", data: product },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET_BY_SLUG]", error);
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
      name: z.string().min(1).min(3),
      slug: z.string().min(1).min(3),
      minimumStock: z.number().min(1),
      category: z.string().min(1),
      status: z.string().min(1),
      linkGojek: z.string().optional(),
      netFill: z.number().min(1),
      description: z.string().optional(),
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

    const {
      name,
      slug,
      minimumStock,
      category,
      status,
      linkGojek,
      netFill,
      description,
    } = response.data;

    const findName = await prismadb.product.findUnique({
      where: {
        name: name,
      },
    });

    if (findName) {
      if (findName.slug !== params.slug) {
        return NextResponse.json(
          {
            message: "Nama sudah digunakan",
          },
          { status: 400 }
        );
      }
    }

    const findSlug = await prismadb.product.findUnique({
      where: {
        slug,
      },
    });

    if (findSlug) {
      if (findSlug.slug !== params.slug) {
        return NextResponse.json(
          {
            message: "Slug sudah digunakan",
          },
          { status: 400 }
        );
      }
    }

    const findCategory = await prismadb.category.findUnique({
      where: {
        name: category,
      },
      select: {
        id: true,
      },
    });

    if (!findCategory) {
      return NextResponse.json(
        {
          message: "Category not found",
        },
        { status: 404 }
      );
    }

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
        {
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const product = await prismadb.product.update({
      where: {
        id: findProduct.id,
      },
      data: {
        name,
        slug: slug.toLowerCase(),
        minimumStock,
        categoryId: findCategory.id,
        status,
        linkGojek,
        netFill,
        description,
      },
    });

    return NextResponse.json(
      {
        message: "Employee successfully updated!",
        data: product.slug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_UPDATE_BY_SLUG]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
