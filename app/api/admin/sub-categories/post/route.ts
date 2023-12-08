import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const POST = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
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

    const findName = await prismadb.subCategory.findUnique({
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

    const findSlug = await prismadb.subCategory.findUnique({
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
        { message: "Category not found" },
        { status: 404 }
      );
    }

    const subCategory = await prismadb.subCategory.create({
      data: {
        name,
        slug,
        categoryId: findCategory.id,
      },
    });

    return NextResponse.json(
      {
        message: "Sub Category successfully created!",
        data: subCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("[SUB_CATEGORY_POST]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
