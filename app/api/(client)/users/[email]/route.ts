import { NextResponse } from "next/server";
import { z } from "zod";

import prismadb from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  try {
    if (!params.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prismadb.user.findFirst({
      where: {
        email: params.email,
        role: "member",
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        address: true,
        phone: true,
        active: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Successfully get user by email",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[USER_GET_BY_EMAIL]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  try {
    if (!params.email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    const findUser = await prismadb.user.findFirst({
      where: {
        email: params.email,
        role: "member",
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const body = await req.json();

    const schema = z.object({
      firstName: z.string().min(1).min(3),
      lastName: z.string().min(1).min(3),
      phone: z.string().min(1).min(10),
      address: z.string().min(1).min(15),
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

    const { firstName, lastName, phone, address } = response.data;

    await prismadb.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        firstName,
        lastName,
        phone,
        address,
      },
    });

    return NextResponse.json({ message: "User updated" }, { status: 200 });
  } catch (error) {
    console.log("[USER_PATCH_BY_EMAIL] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
