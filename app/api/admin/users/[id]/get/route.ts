import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const dynamic = "force-dynamic";
export const dynamicParams = false;
export const revalidate = 0;

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const searchParams = req.nextUrl.searchParams;

  const pageParams = searchParams.get("page");

  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    if (!params.id) {
      return NextResponse.json({ message: "Id is required" }, { status: 400 });
    }

    const page = parseInt(pageParams ? pageParams : "1");

    const take: number = 10;

    const skip: number = (page - 1) * take;

    const user = await prismadb.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        address: true,
        phone: true,
        active: true,
        order: {
          take,
          skip,
          select: {
            invoice: true,
            statusOrder: true,
            paymentMethod: true,
            statuspayment: true,
            totalItem: true,
            grandTotal: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const total = await prismadb.order.count({
      where: {
        userId: params.id,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Successfully get user by id",
        data: {
          user,
          totalPage: Math.ceil(total / take),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[USERS_ID_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
