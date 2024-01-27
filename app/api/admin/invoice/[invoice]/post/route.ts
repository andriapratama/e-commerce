import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { TemplateInvoice } from "@/utils/TemplateInvoice";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { invoice: string } }
) => {
  try {
    const { validation, findEmployee } = await ApiAdminValidation();

    if (validation.error) {
      return NextResponse.json(
        { message: validation.message },
        { status: validation.status }
      );
    }

    if (!params.invoice) {
      return NextResponse.json(
        { message: "Invoice is required" },
        { status: 400 }
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

    const mailOptions = {
      from: process.env.EMAIL,
      to: findOrder.userEmail,
      subject: "Invoice",
      html: TemplateInvoice(findOrder, findSetting),
    };

    await transporter.sendMail(mailOptions);

    await prismadb.orderLog.create({
      data: {
        status: "invoice",
        employeeName: findEmployee?.name,
        employeeId: findEmployee?.id,
        orderId: findOrder.id,
      },
    });

    return NextResponse.json(
      { message: "Invoice has been sent" },
      { status: 200 }
    );
  } catch (error) {
    console.log("[SEND_INVOICE] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
