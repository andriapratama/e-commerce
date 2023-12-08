import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

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
        { message: "Sub category slug is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const schema = z.object({
      name: z.string().min(3),
      slug: z.string().min(3),
      categorySlug: z.string().min(1),
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

    const { name, slug, categorySlug } = response.data;

    const findName = await prismadb.subCategory.findFirst({
      where: {
        name: name,
      },
    });

    if (findName) {
      return NextResponse.json(
        {
          message: "Nama sub kategori sudah ada.",
        },
        { status: 400 }
      );
    }

    const findSlug = await prismadb.subCategory.findFirst({
      where: {
        slug: slug,
      },
    });

    if (findSlug) {
      return NextResponse.json(
        {
          message: "Slug sub kategori sudah ada.",
        },
        { status: 400 }
      );
    }

    const findCategory = await prismadb.category.findUnique({
      where: {
        slug: categorySlug,
      },
    });

    if (!findCategory) {
      return NextResponse.json(
        { message: "Category is not found" },
        { status: 404 }
      );
    }

    await prismadb.subCategory.update({
      where: {
        slug: params.slug,
      },
      data: {
        name,
        slug,
        categoryId: findCategory.id,
      },
    });

    return NextResponse.json(
      {
        message: "Sub Category successfully updated!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SUB_CATEGORY_PATCH]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
