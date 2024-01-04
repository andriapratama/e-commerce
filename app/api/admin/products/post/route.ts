import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { UploadImage } from "@/utils/UploadImage";

export const POST = async (req: Request) => {
  try {
    const { validation, findEmployee } = await ApiAdminValidation();

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
      totalStock: z.string().min(1),
      minimumStock: z.string().min(1),
      price: z.string().min(1).min(3),
      cost: z.string().min(1).min(3),
      category: z.string().min(1),
      subCategory: z.string().optional(),
      status: z.enum(["new", "active", "best", "sale", "archive"]),
      linkGojek: z.string().optional(),
      netFill: z.string().min(1),
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
      totalStock,
      minimumStock,
      price,
      cost,
      category,
      subCategory,
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
      return NextResponse.json(
        {
          message: "Nama sudah digunakan",
        },
        { status: 400 }
      );
    }
    const findSlug = await prismadb.product.findUnique({
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

    const findCategory = await prismadb.category.findUnique({
      where: {
        slug: category,
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

    let subCategoryId: string | null = null;

    if (subCategory) {
      const findSubCategory = await prismadb.subCategory.findUnique({
        where: {
          slug: subCategory,
        },
      });

      if (!findSubCategory) {
        return NextResponse.json(
          { message: "Sub category not found" },
          { status: 404 }
        );
      }

      subCategoryId = findSubCategory.id;
    }

    const image: File | null = data.get("image") as unknown as File;

    if (!image) {
      return NextResponse.json({ message: "Image required" }, { status: 400 });
    }

    const { imageLink, imagePathname } = await UploadImage(image);

    const product = await prismadb.product.create({
      data: {
        name,
        slug: slug.toLowerCase(),
        totalStock: parseInt(totalStock),
        minimumStock: parseInt(minimumStock),
        price: parseInt(price),
        cost: parseInt(cost),
        status,
        linkGojek,
        netFill: parseInt(netFill),
        description,
        image: imageLink,
        imagePathname: imagePathname ? imagePathname : "",
        categoryId: findCategory.id,
        subCategoryId: subCategoryId,
      },
    });

    if (findEmployee) {
      await Promise.all([
        prismadb.productFinanceLog.create({
          data: {
            price: parseInt(price),
            cost: parseInt(cost),
            productId: product.id,
            employeeId: findEmployee.id,
            note: "Pertama kali dibuat",
          },
        }),

        prismadb.productStockLog.create({
          data: {
            previousStock: 0,
            stock: parseInt(totalStock),
            stockNow: parseInt(totalStock),
            status: "first",
            note: "Pertama kali dibuat",
            productId: product.id,
            employeeId: findEmployee.id,
          },
        }),

        prismadb.productStatusLog.create({
          data: {
            status,
            salePrice: 0,
            note: "Pertama kali dibuat",
            productId: product.id,
            employeeId: findEmployee.id,
          },
        }),
      ]);
    }

    return NextResponse.json(
      {
        message: "Product created!",
        data: slug.toLowerCase(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("[PRODUCT_POST", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
