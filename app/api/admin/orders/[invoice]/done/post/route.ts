import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { ApiAdminValidation } from "@/utils/ApiAdminValidation";
import { ConvertDateId } from "@/utils/ConvertDateId";

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
        orderDetail: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!findOrder) {
      return NextResponse.json(
        { message: "Order is required" },
        { status: 404 }
      );
    }

    const products: { productId: string; total: number; cost: number }[] = [];

    const promos: { promoId: string; quantity: number }[] = [];

    const orderDetail = findOrder.orderDetail;

    for (let i = 0; i < orderDetail.length; i++) {
      const quantity = orderDetail[i].quantity;

      if (orderDetail[i].productId) {
        const id = orderDetail[i].productId;

        const product = orderDetail[i].product;

        let cost: number = 0;

        if (product) {
          cost = product.cost;
        }

        products.push({
          productId: id ? id : "",
          total: quantity,
          cost: cost,
        });
      }

      if (orderDetail[i].promoId) {
        const id = orderDetail[i].promoId;

        promos.push({ promoId: id ? id : "", quantity: quantity });
      }
    }

    for (let i = 0; i < promos.length; i++) {
      const findPromo = await prismadb.promo.findUnique({
        where: {
          id: promos[i].promoId,
        },
        include: {
          promoProductBonus: {
            include: {
              product: true,
            },
          },
          promoProductProvision: {
            include: {
              product: true,
            },
          },
        },
      });

      if (findPromo) {
        const bonus = findPromo.promoProductBonus;
        const provision = findPromo.promoProductProvision;

        for (let idx = 0; idx < bonus.length; idx++) {
          const index = products.findIndex(
            (product) => product.productId === bonus[idx].productId
          );

          const product = bonus[idx].product;

          let cost: number = 0;

          if (product) {
            cost = product.cost;
          }
          if (index < 0) {
            products.push({
              productId: bonus[idx].productId,
              total: bonus[idx].quantity * promos[i].quantity,
              cost: cost,
            });
          } else {
            products[index].total += bonus[idx].quantity * promos[i].quantity;
          }
        }

        for (let idx = 0; idx < provision.length; idx++) {
          const index = products.findIndex(
            (product) => product.productId === provision[idx].productId
          );

          const product = provision[idx].product;

          let cost: number = 0;

          if (product) {
            cost = product.cost;
          }

          if (index < 0) {
            products.push({
              productId: provision[idx].productId,
              total: provision[idx].quantity * promos[i].quantity,
              cost: cost,
            });
          } else {
            products[index].total +=
              provision[idx].quantity * promos[i].quantity;
          }
        }
      }
    }

    let totalCost: number = 0;

    for (let i = 0; i < products.length; i++) {
      totalCost += products[i].cost * products[i].total;
    }

    const totalSale = findOrder.grandTotal ? findOrder.grandTotal : 0;

    const totalProfit = totalSale - totalCost;

    await Promise.all([
      prismadb.order.update({
        where: {
          invoice: params.invoice,
        },
        data: {
          statusOrder: "done",
        },
      }),

      prismadb.orderLog.create({
        data: {
          status: "done",
          employeeName: findEmployee?.name,
          employeeId: findEmployee?.id,
          orderId: findOrder.id,
        },
      }),
    ]);

    const today = new Date();

    const findTotalSale = await prismadb.totalSales.findFirst({
      where: {
        createdAt: {
          gte: new Date(ConvertDateId(today).fullDateNumber),
        },
      },
    });

    if (findTotalSale) {
      await prismadb.totalSales.update({
        where: {
          id: findTotalSale.id,
        },
        data: {
          sales: findTotalSale.sales + totalSale,
          profit: findTotalSale.profit + totalProfit,
        },
      });
    } else {
      await prismadb.totalSales.create({
        data: {
          sales: totalSale as number,
          profit: totalProfit,
        },
      });
    }

    for (let i = 0; i < products.length; i++) {
      const findProductSold = await prismadb.productSoldLog.findMany({
        where: {
          productId: products[i].productId,
          createdAt: {
            gte: new Date(ConvertDateId(today).fullDateNumber),
          },
        },
      });

      if (findProductSold[0]) {
        await prismadb.productSoldLog.update({
          where: {
            id: findProductSold[0].id,
          },
          data: {
            total: findProductSold[0].total + products[i].total,
          },
        });
      } else {
        await prismadb.productSoldLog.create({
          data: {
            total: products[i].total,
            productId: products[i].productId,
          },
        });
      }

      const findProduct = await prismadb.product.findUnique({
        where: {
          id: products[i].productId,
        },
        select: {
          totalStock: true,
        },
      });

      if (findProduct) {
        await prismadb.product.update({
          where: {
            id: products[i].productId,
          },
          data: {
            totalStock: findProduct.totalStock - products[i].total,
          },
        });

        await prismadb.productStockLog.create({
          data: {
            previousStock: findProduct.totalStock,
            stock: products[i].total,
            stockNow: findProduct.totalStock - products[i].total,
            status: "decrease",
            note: "Transaksi order, nomor invoice",
            productId: products[i].productId,
            employeeId: findEmployee ? findEmployee.id : "",
            invoice: params.invoice,
          },
        });
      }
    }

    return NextResponse.json({ message: "Order is done" }, { status: 201 });
  } catch (error) {
    console.log("[DONE_POST] " + error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
