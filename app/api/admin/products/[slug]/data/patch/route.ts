import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation();

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
      name: z.string().min(1).min(3),
      slug: z.string().min(1).min(3),
      minimumStock: z.number().min(1),
      category: z.string().min(1),
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
        linkGojek,
        netFill,
        description,
      },
    });

    return NextResponse.json(
      {
        message: "Data product successfully updated!",
        data: product.slug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_UPDATE_BY_SLUG]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
