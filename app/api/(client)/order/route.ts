import { authOptions } from "@/lib/auth";
import prismadb from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: "Your are not logged in",
        },
        {
          status: 401,
        }
      );
    }

    if (session.user.role !== "member") {
      return NextResponse.json(
        { message: "You are not have access" },
        { status: 401 }
      );
    }

    const email = session.user.email;

    const findUser = await prismadb.user.findUnique({
      where: {
        email,
        role: "member",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!findUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    const schema = z.object({
      paymentMethod: z.string().min(1),
      note: z.string().optional(),
    });

    const response = schema.safeParse(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        { message: "Invalid request", errors },
        { status: 400 }
      );
    }

    const { paymentMethod, note } = response.data;

    const findCart = await prismadb.cart.findMany({
      where: {
        userId: findUser.id,
        status: true,
      },
      select: {
        id: true,
        quantity: true,
        total: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            status: true,
            salePrice: true,
          },
        },
      },
    });

    const findOrder = await prismadb.order.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    let invoice: string = "";

    if (!findOrder) {
      invoice = "ODR1";
    } else {
      const prevInvoice = findOrder.invoice;
      const getNumber = prevInvoice.replace("ODR", "");
      const number = parseInt(getNumber);
      invoice = `ODR${number + 1}`;
    }

    const order = await prismadb.order.create({
      data: {
        invoice,
        statusOrder: "new",
        paymentMethod: paymentMethod === "cash" ? "cash" : "transfer",
        statuspayment: "pending",
        note,
        userName: `${findUser.firstName} ${findUser.lastName}`,
        userEmail: findUser.email,
        userId: findUser.id,
        userPhone: findUser.phone ? findUser.phone : "",
        totalItem: 0,
      },
    });

    let subTotal: number = 0;
    let tax: number = 0;
    let total: number = 0;
    let totalItem: number = 0;

    for (let i = 0; i < findCart.length; i++) {
      const product = findCart[i].product;
      const cart = findCart[i];

      subTotal += cart.total;
      totalItem += cart.quantity;

      await prismadb.orderDetail.create({
        data: {
          name: product.name,
          price: product.status === "sale" ? product.salePrice : product.price,
          quantity: cart.quantity,
          total: cart.total,
          productId: product.id,
          orderId: order.id,
        },
      });
    }

    tax = (subTotal / 100) * 11;

    total = subTotal + tax;

    await prismadb.order.update({
      where: {
        id: order.id,
      },
      data: {
        subTotal,
        tax,
        grandTotal: total,
      },
    });

    await prismadb.orderLog.create({
      data: {
        status: "new",
        orderId: order.id,
      },
    });

    await prismadb.order.update({
      where: {
        id: order.id,
      },
      data: {
        totalItem,
      },
    });

    for (let i = 0; i < findCart.length; i++) {
      await prismadb.cart.delete({
        where: {
          id: findCart[i].id,
        },
      });
    }

    return NextResponse.json({ message: "Order Created" }, { status: 201 });
  } catch (error) {
    console.log("[ORDER_POST]" + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
