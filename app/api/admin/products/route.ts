import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: "You are not logged in",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "super admin") {
      return NextResponse.json(
        {
          message: "You are not have access",
        },
        { status: 401 }
      );
    }

    const username = session.user.username;

    const employee = await prismadb.employee.findUnique({
      where: {
        username: username,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 400 }
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
      status: z.string().min(1),
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
        { status: 400 }
      );
    }

    const image: File | null = data.get("image") as unknown as File;

    if (!image) {
      return NextResponse.json({ message: "Image required" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imageName = `${Date.now()}-${image.name}`;

    const urlUpload = "https://content.dropboxapi.com/2/files/upload";
    const pathUpload =
      '{"path": "' +
      "/test202310" +
      "/" +
      imageName +
      '","mode": "add","autorename": true,"mute": false}';

    const upload = await axios.post(urlUpload, buffer, {
      headers: {
        Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
        "Content-Type": "application/octet-stream",
        "Dropbox-API-Arg": pathUpload,
      },
    });

    const pathDisplay = upload.data.path_display;

    if (!pathDisplay) {
      return NextResponse.json(
        { message: "Image failed to upload" },
        { status: 400 }
      );
    }

    const urlGet =
      "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";

    const pathGet =
      '{"path":"' +
      pathDisplay +
      '","settings":{"access":"viewer","allow_download":true,"audience":"public","requested_visibility":"public"}}';

    const getImageLink = await axios.post(urlGet, pathGet, {
      headers: {
        Authorization: "Bearer " + process.env.DROPBOX_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const imageLink = getImageLink.data.url;

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
        image: imageLink + "&raw=1",
        imagePathname: pathDisplay,
        categoryId: findCategory.id,
      },
    });

    await prismadb.productFinanceLog.create({
      data: {
        price: parseInt(price),
        cost: parseInt(cost),
        productId: product.id,
        employeeId: employee.id,
        note: "Pertama kali dibuat",
      },
    });

    await prismadb.productStockLog.create({
      data: {
        previousStock: 0,
        stock: parseInt(totalStock),
        stockNow: parseInt(totalStock),
        status: "first",
        note: "Pertama kali dibuat",
        productId: product.id,
        employeeId: employee.id,
      },
    });

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

export const GET = async (req: Request) => {
  try {
    const products = await prismadb.product.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        name: true,
        slug: true,
        totalStock: true,
        minimumStock: true,
        price: true,
        cost: true,
        netFill: true,
        status: true,
        linkGojek: true,
        description: true,
        image: true,
        sale: true,
        salePrice: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Successfully get all products",
        data: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
