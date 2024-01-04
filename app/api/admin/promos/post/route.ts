import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { UploadImage } from "@/utils/UploadImage";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { ProductInputType } from "@/components/admin/promo-add/PromoAddForm";

export const POST = async (req: Request) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const data = await req.formData();
    const body = Object.fromEntries(data);

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

    const dataProvisions: string | null = data.get(
      "provisions"
    ) as unknown as string;
    const dataBonus: string | null = data.get("bonus") as unknown as string;
    const image: File | null = data.get("image") as unknown as File;

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

    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const findName = await prismadb.promo.findUnique({
      where: {
        name: name,
      },
    });

    if (findName) {
      return NextResponse.json(
        {
          message: "Nama sudah digunakan",
        },
        { status: 400 }
      );
    }

    const findSlug = await prismadb.promo.findUnique({
      where: {
        slug: slug,
      },
    });

    if (findSlug) {
      return NextResponse.json(
        {
          message: "Slug sudah digunakan",
        },
        { status: 400 }
      );
    }

    const { imageLink, imagePathname } = await UploadImage(image);

    const promo = await prismadb.promo.create({
      data: {
        image: imageLink,
        imagePathname: imagePathname ? imagePathname : "",
        name,
        slug,
        description: description ? description : "",
        firstPrice: parseInt(firstPrice),
        promoPrice: parseInt(promoPrice),
        status: status === "active" ? "active" : "archive",
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
            promoId: promo.id,
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
            promoId: promo.id,
            productId: findProduct.id,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: "Promo is created",
        data: {
          slug: promo.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("[PROMO_POST] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
