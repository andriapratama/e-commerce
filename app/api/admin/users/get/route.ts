import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { AdminUserType } from "@/types/UserType";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";

export const dynamic = "force-dynamic";
export const dynamicParams = false;
export const revalidate = 0;

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const searchValueParams = searchParams.get("search");
  const pageParams = searchParams.get("page");
  const roleParams = searchParams.get("role");
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    if (!roleParams) {
      return NextResponse.json(
        { message: "Role is required" },
        { status: 400 }
      );
    }

    const page = parseInt(pageParams ? pageParams : "1");
    const search = searchValueParams ? searchValueParams : "";

    let total: number = 0;

    const take: number = 20;

    const skip: number = (page - 1) * take;

    let users: AdminUserType[] = [];

    const select = {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      address: true,
      phone: true,
      active: true,
    };

    if (search) {
      users = await prismadb.user.findMany({
        where: {
          role: roleParams === "member" ? "member" : "guest",
          OR: [
            {
              email: { contains: search },
            },
          ],
        },
        take,
        orderBy: {
          email: "asc",
        },
        select,
      });
    } else {
      users = await prismadb.user.findMany({
        where: {
          role: roleParams === "member" ? "member" : "guest",
        },
        take,
        skip,
        orderBy: {
          createdAt: "desc",
        },
        select,
      });

      total = await prismadb.user.count({
        where: {
          role: roleParams === "member" ? "member" : "guest",
        },
      });
    }

    return NextResponse.json(
      {
        message: "Success to get all data users",
        data: {
          users,
          totalPage: Math.ceil(total / take),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("[USER_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
