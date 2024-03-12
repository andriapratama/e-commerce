import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { TemplateInvoiceImage } from "@/utils/TemplateInvoiceImage";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const GET = async (
  req: Request,
  { params }: { params: { invoice: string } }
) => {
  try {
    const { validation } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    const findOrder = await prismadb.order.findUnique({
      where: {
        invoice: params.invoice,
      },
      include: {
        orderDetail: true,
        user: {
          select: {
            address: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!findOrder) {
      return NextResponse.json(
        { message: "Order is not found" },
        { status: 404 }
      );
    }

    const findSetting = await prismadb.setting.findFirst();

    if (!findSetting) {
      return NextResponse.json(
        { message: "Setting is not found" },
        { status: 404 }
      );
    }

    const html = TemplateInvoiceImage(findOrder, findSetting);

    const browser = await puppeteer.launch({
      headless: "new",
    });

    const page = await browser.newPage();

    await page.setContent(html);

    const content = await page.$("#content");

    if (content) {
      const imageBuffer = await content.screenshot({
        omitBackground: true,
        type: "png",
      });

      return new Response(imageBuffer, {
        headers: { "content-type": "image/png" },
      });
    }
  } catch (error) {
    console.log("[INVOICE_DOWNLOAD] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
