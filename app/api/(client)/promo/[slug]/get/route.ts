import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export const dynamic = "force-dynamic";

export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const promo = await prismadb.promo.findUnique({
      where: {
        slug: params?.slug,
      },
    });

    if (!promo) {
      return NextResponse.json({ message: "Promo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Successfully to get promo data by slug", data: promo },
      { status: 200 }
    );
  } catch (error) {
    console.log("[PROMOS_DETAIL_GET] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
