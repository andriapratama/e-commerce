import prismadb from "@/lib/prismadb";
import { CartLocalType } from "@/types/CartType";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const schema = z.object({
      firstName: z.string().min(1).min(3),
      lastName: z.string().min(1).min(3),
      phone: z.string().min(9).max(16),
      email: z.string().min(1).email(),
      address: z.string().min(1).min(10),
      note: z.string().optional(),
      paymentMethod: z.string().min(1),
    });

    const response = schema.safeParse(body);

    if (!response.success) {
      const { errors } = response.error;

      return NextResponse.json(
        { message: "Invalid request", errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, email, address, paymentMethod, note } =
      response.data;

    const user = await prismadb.user.create({
      data: {
        firstName,
        lastName,
        email,
        address,
        phone,
        role: "guest",
      },
    });

    const findOrder = await prismadb.order.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    let invoice: string = "";

    if (!findOrder) {
      invoice = "ODR001";
    } else {
      const prevInvoice = findOrder.invoice;
      const getNumber = prevInvoice.replace("ODR00", "");
      const number = parseInt(getNumber);
      invoice = `ODR00${number + 1}`;
    }

    const order = await prismadb.order.create({
      data: {
        invoice,
        statusOrder: "new",
        paymentMethod: paymentMethod === "cash" ? "cash" : "transfer",
        statuspayment: "pending",
        note,
        userName: `${firstName} ${lastName}`,
        userEmail: email,
        userId: user.id,
        userPhone: phone,
        totalItem: 0,
      },
    });

    let subTotal: number = 0;
    let tax: number = 0;
    let grandTotal: number = 0;
    let totalItem: number = 0;

    const carts: CartLocalType[] = body.carts;

    if (carts.length === 0) {
      return NextResponse.json({ message: "Carts empty" }, { status: 400 });
    }

    for (let i = 0; i < carts.length; i++) {
      const cart: CartLocalType = carts[i];

      const total =
        cart.salePrice > 0
          ? cart.salePrice * cart.quantity
          : cart.price * cart.quantity;

      subTotal += total;
      totalItem += cart.quantity;

      if (cart.type === "product") {
        const findProduct = await prismadb.product.findUnique({
          where: {
            slug: cart.slug,
          },
          select: {
            id: true,
          },
        });

        await prismadb.orderDetail.create({
          data: {
            name: cart.name,
            price: cart.salePrice > 0 ? cart.salePrice : cart.price,
            quantity: cart.quantity,
            total: total,
            productId: findProduct?.id,
            orderId: order.id,
          },
        });
      } else {
        const findPromo = await prismadb.promo.findUnique({
          where: {
            slug: cart.slug,
          },
          select: {
            id: true,
          },
        });

        await prismadb.orderDetail.create({
          data: {
            name: cart.name,
            price: cart.salePrice > 0 ? cart.salePrice : cart.price,
            quantity: cart.quantity,
            total: total,
            promoId: findPromo?.id,
            orderId: order.id,
          },
        });
      }
    }

    tax = (subTotal / 100) * 11;

    grandTotal = subTotal + tax;

    await prismadb.order.update({
      where: {
        id: order.id,
      },
      data: {
        subTotal,
        tax,
        grandTotal,
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

    return NextResponse.json({ message: "masuk" }, { status: 201 });
  } catch (error) {
    console.log("[Checkout_POST] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
