import { ProductInputType } from "@/components/admin/promo-add/PromoAddForm";
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

    const data = await req.formData();
    const body = Object.fromEntries(data);

    const schema = z.object({
      firstPrice: z.string().min(1).min(4),
      promoPrice: z.string().min(1).min(4),
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

    const { firstPrice, promoPrice } = response.data;

    const dataProvisions: string | null = data.get(
      "provisions"
    ) as unknown as string;
    const dataBonus: string | null = data.get("bonus") as unknown as string;

    const provisions: ProductInputType[] = JSON.parse(dataProvisions);
    const bonus: ProductInputType[] = JSON.parse(dataBonus);

    if (!provisions) {
      return NextResponse.json(
        { message: "Product provisions is required" },
        { status: 400 }
      );
    }
    if (!bonus) {
      return NextResponse.json(
        { message: "Product bonus is required" },
        { status: 400 }
      );
    }

    const findPromo = await prismadb.promo.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!findPromo) {
      return NextResponse.json(
        { message: "Promo is not found" },
        { status: 404 }
      );
    }

    await prismadb.promoProductProvision.deleteMany({
      where: {
        promoId: findPromo.id,
      },
    });

    await prismadb.promoProductBonus.deleteMany({
      where: {
        promoId: findPromo.id,
      },
    });

    await prismadb.promo.update({
      where: {
        slug: params.slug,
      },
      data: {
        firstPrice: parseInt(firstPrice),
        promoPrice: parseInt(promoPrice),
      },
    });

    for (let i = 0; i < provisions.length; i++) {
      const findProduct = await prismadb.product.findUnique({
        where: {
          name: provisions[i].name,
        },
      });

      if (findProduct) {
        await prismadb.promoProductProvision.create({
          data: {
            name: provisions[i].name,
            price: provisions[i].price,
            quantity: provisions[i].quantity,
            subTotal: provisions[i].subTotal,
            promoId: findPromo.id,
            productId: findProduct.id,
          },
        });
      }
    }

    for (let i = 0; i < bonus.length; i++) {
      const findProduct = await prismadb.product.findUnique({
        where: {
          name: bonus[i].name,
        },
      });

      if (findProduct) {
        await prismadb.promoProductBonus.create({
          data: {
            name: bonus[i].name,
            price: bonus[i].price,
            quantity: bonus[i].quantity,
            subTotal: bonus[i].subTotal,
            promoId: findPromo.id,
            productId: findProduct.id,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Promo products is updated" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PROMO_PRODUCT_PATCH] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
