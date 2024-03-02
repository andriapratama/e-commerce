"use client";

import React, { useEffect } from "react";
import Title from "@/components/admin/Title";
import { ToastContainer } from "react-toastify";
import { ConvertTime } from "@/utils/ConvertTime";
import PageLoading from "@/components/PageLoading";
import { ConvertDateId } from "@/utils/ConvertDateId";
import { useGetOrderHook } from "@/hooks/admin/GetOrderHook";
import OrderDetailInfo from "@/components/admin/order-detail/OrderDetailInfo";
import OrderDetailCard from "@/components/admin/order-detail/OrderDetailCard";
import OrderDetailTable from "@/components/admin/order-detail/OrderDetailTable";
import OrderDetailLog from "@/components/admin/order-detail/OrderDetailLog";
import OrderDetailButton from "@/components/admin/order-detail/OrderDetailButton";
import Link from "next/link";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import AdminLoading from "../../loading";

const OrderDetail = () => {
  const { order, isLoadingContent, getOrder, orderLogs, setIsLoadingContent } =
    useGetOrderHook();

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
          ) : (
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
                      href={`https://web.whatsapp.com/send/?phone=%2B${order.user.phone}&text&type=phone_number&app_absent=0`}
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

                <OrderDetailButton
                  order={order}
                  getOrder={getOrder}
                  orderLogs={orderLogs}
                  setIsLoadingContent={setIsLoadingContent}
                />
              </div>

              <OrderDetailLog orderLogs={orderLogs} />
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
};

export default OrderDetail;
