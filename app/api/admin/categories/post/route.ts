import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";
import { z } from "zod";

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

    const { name, slug } = response.data;

    const findName = await prismadb.category.findFirst({
      where: {
        name: name,
      },
    });

    if (findName) {
      return NextResponse.json(
        {
          message: "Nama kategori sudah ada.",
        },
        { status: 400 }
      );
    }

    const findSlug = await prismadb.category.findFirst({
      where: {
        slug: slug,
      },
    });

    if (findSlug) {
      return NextResponse.json(
        {
          message: "Slug kategori sudah ada.",
        },
        { status: 400 }
      );
    }

    if (!findName && !findSlug) {
      const category = await prismadb.category.create({
        data: {
          name,
          slug,
        },
      });

      return NextResponse.json(
        {
          message: "Category successfully created!",
          data: category,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
