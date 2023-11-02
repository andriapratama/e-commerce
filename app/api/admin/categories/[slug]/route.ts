import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    if (!params.slug) {
      return new NextResponse("Category slug is required", { status: 400 });
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

    const category = await prismadb.category.update({
      where: {
        slug: params.slug,
      },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(
      {
        message: "Category successfully updated!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Server error", { status: 500 });
  }
};
