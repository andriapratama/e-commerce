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
      firstPrice: z.string().min(1).min(4),
      promoPrice: z.string().min(1).min(4),
      status: z.string().min(1),
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

    const { name, slug, firstPrice, promoPrice, status, description } =
      response.data;

    const findName = await prismadb.promo.findUnique({
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

    const findSlug = await prismadb.promo.findUnique({
      where: {
        slug: slug,
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

    const promo = await prismadb.promo.update({
      where: {
        slug: params.slug,
      },
      data: {
        name,
        slug,
        description: description ? description : "",
        firstPrice: parseInt(firstPrice),
        promoPrice: parseInt(promoPrice),
        status: status === "active" ? "active" : "archive",
      },
    });

    return NextResponse.json(
      { message: "Promo data is updated", data: { slug: promo.slug } },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PROMO_DATA_PATCH] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
