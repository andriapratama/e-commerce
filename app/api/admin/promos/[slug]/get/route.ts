import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { NextResponse } from "next/server";

export const GET = async (
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

    const promo = await prismadb.promo.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        image: true,
        imagePathname: true,
        name: true,
        slug: true,
        description: true,
        firstPrice: true,
        promoPrice: true,
        status: true,
        createdAt: true,
        promoProductBonus: {
          select: {
            name: true,
            price: true,
            quantity: true,
            subTotal: true,
            product: {
              select: {
                image: true,
              },
            },
          },
        },
        promoProductProvision: {
          select: {
            name: true,
            price: true,
            quantity: true,
            subTotal: true,
            product: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!promo) {
      return NextResponse.json({ message: "Promo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Successfully to get promo data with slug", data: promo },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PROMO_SLUG_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
