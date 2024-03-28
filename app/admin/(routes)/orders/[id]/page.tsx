"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { useGetOrderHook } from "@/hooks/admin/GetOrderHook";
import { ConvertDateId } from "@/utils/ConvertDateId";
import { ConvertTime } from "@/utils/ConvertTime";

const Title = dynamic(() => import("@/components/admin/Title"));
const OrderDetailInfo = dynamic(
  () => import("@/components/admin/order-detail/OrderDetailInfo")
);
const OrderDetailCard = dynamic(
  () => import("@/components/admin/order-detail/OrderDetailCard")
);
const OrderDetailTable = dynamic(
  () => import("@/components/admin/order-detail/OrderDetailTable")
);
const OrderDetailLog = dynamic(
  () => import("@/components/admin/order-detail/OrderDetailLog")
);
const OrderDetailButton = dynamic(
  () => import("@/components/admin/order-detail/OrderDetailButton")
);

const OrderDetail = () => {
  const { order, isLoadingContent } = useGetOrderHook();

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />

          {isLoadingContent ? (
            <PageLoading />
          ) : order ? (
            <React.Fragment>
              <Title
                title="Detail Order"
                invoice={"#" + order.invoice}
                statusOrder={order.statusOrder}
              />
              <div className="grid grid-cols-3 gap-4">
                <OrderDetailCard title="Pelanggan">
                  <div>
                    {order.user.firstName} {order.user.lastName}
                  </div>
                  <div>
                    <Link
                      href={`mailto:${order.user.email}`}
                      target="_blank"
                      className="w-fit hover:border-b border-blue-500 hover:text-blue-500"
                    >
                      {order.user.email}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href={`https://wa.me/${order.user.phone}`}
                      target="_blank"
                      className="w-fit hover:border-b border-blue-500 hover:text-blue-500"
                    >
                      {order.user.phone}
                    </Link>
                  </div>
                </OrderDetailCard>
                <OrderDetailCard title="Dikirim ke">
                  <div className="text-capitalize">{order.user.address}</div>
                </OrderDetailCard>
                <OrderDetailCard title="Tanggal pesan & Pembayaran">
                  <div>{ConvertTime(order.createdAt)}</div>
                  <div className="capitalize">
                    {ConvertDateId(order.createdAt).fullDateName}
                  </div>
                  <div className="capitalize">
                    {order.paymentMethod === "cash" ? "tunai" : "transfer"}
                  </div>
                </OrderDetailCard>
              </div>

              <div className="bg-white rounded-md shadow-md w-full p-7 mt-10">
                <OrderDetailTable order={order} />

                <div className="w-full flex justify-between">
                  <div className="w-[400px]">
                    <div className="font-semibold text-gray-800">Catatan</div>
                    <p className="text-gray-600">{order.note}</p>
                  </div>
                  <div className="w-fit">
                    <OrderDetailInfo name="Total" value={order.subTotal} />
                    <OrderDetailInfo name="Tax" value={order.tax} />
                    <OrderDetailInfo name="Pengiriman" value={order.shipping} />
                    <OrderDetailInfo name="Diskon" value={order.discount} />
                    <OrderDetailInfo
                      name="Grand Total"
                      value={order.grandTotal}
                    />
                    <OrderDetailInfo
                      name="Status Pembayaran"
                      statusPayment={order.statuspayment}
                    />
                  </div>
                </div>

                <OrderDetailButton order={order} orderLogs={order.orderLog} />
              </div>

              <OrderDetailLog orderLogs={order.orderLog} />
            </React.Fragment>
          ) : null}
        </div>
      </section>
    );
  }
};

export default OrderDetail;
