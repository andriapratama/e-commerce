import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const promos = await prismadb.promo.findMany({
      where: {
        NOT: {
          status: "archive",
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(
      { message: "Successfully to get all promo", data: promos },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PROMO_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
