"use client";

import React from "react";
import { useGetOrderHook } from "@/hooks/admin/GetOrderHook";
import InvoiceTable from "@/components/admin/invoice/InvoiceTable";
import { ConvertIDR } from "@/utils/ConvertIDR";
import PageLoading from "@/components/PageLoading";

const Invoice = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { order, isLoadingContent } = useGetOrderHook();

  const user = order.user;

  const date = new Date(order.createdAt);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const cost = (name: string, value: number) => {
    return (
      <div className="w-full flex justify-end mb-2">
        <div className="w-[210px] px-2 flex justify-between font-semibold">
          {name} <div className="font-normal">{ConvertIDR(value)}</div>
        </div>
      </div>
    );
  };

  if (isLoadingContent) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="w-full flex justify-center">
          <div className="w-[595px] h-[842px] bg-orange-300 overflow-hidden relative">
            <div className="w-full h-full px-10 pt-16 bg-white rounded-tl-[300px] relative">
              <div className="w-full flex justify-center">
                <div className="text-3xl">Logo</div>
              </div>

              <div className="w-full grid grid-cols-2 mt-12 text-xs gap-3 ">
                <div className="w-full mt-2">
                  <div className="font-semibold uppercase text-orange-500">
                    Billed to:
                  </div>
                  <div className="capitalize">
                    {user.firstName} {user.lastName}
                  </div>
                  <div>{user.phone}</div>
                  <div>{user.email}</div>
                  <div>{user.address}</div>
                </div>

                <div className="w-full text-right">
                  <div className="text-2xl uppercase leading-10">Invoice</div>
                  <div>Invoice No: {order.invoice}</div>
                  <div>Order Date: {`${day} ${month} ${year}`}</div>
                  <div>
                    Payment Method:{" "}
                    <span className="uppercase">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div className="w-full mt-7">
                <InvoiceTable orderDetail={order.orderDetail} />
              </div>

              <div className="w-full grid grid-cols-2 gap-3 text-xs">
                <div className="w-full">
                  <div className="font-semibold uppercase mb-2 text-orange-500">
                    Note:
                  </div>
                  <div>{order.note}</div>
                </div>

                <div className="w-full">
                  {cost("Total", order.subTotal)}
                  {cost("Tax", order.tax)}
                  {cost("Shipping", order.shipping ? order.shipping : 0)}
                  {cost("Discount", order.discount ? order.discount : 0)}
                  <div className="w-full flex justify-end mb-2">
                    <div className="w-[210px] px-2 pt-2 pb-1 flex justify-between font-semibold text-sm bg-orange-300 text-black">
                      Grand Total <div>{ConvertIDR(order.grandTotal)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 text-xs mt-7">
                <div className="w-full">
                  <div className="uppercase font-semibold text-orange-500">
                    payment information
                  </div>
                  <div className="capitalize">mandiri bank</div>
                  <div className="capitalize">account name: andria pratama</div>
                  <div className="capitalize">
                    account number: 21398712398734918
                  </div>
                  <div>Pay by 4 December 2023</div>
                </div>

                <div className="w-full h-full flex justify-center items-center">
                  <div className="text-sm">Thank you!</div>
                </div>
              </div>
            </div>
            <div className="absolute w-full h-10 bottom-0 bg-orange-300 z-50"></div>
          </div>
        </div>
      </section>
    );
  }
};

export default Invoice;
