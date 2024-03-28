"use client";

import axios from "axios";
import { ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import PageLoading from "@/components/PageLoading";
import { Button } from "@/components/ui/button";
import { useGetOrderHook } from "@/hooks/admin/GetOrderHook";
import { useGetSettingHook } from "@/hooks/admin/SettingHook";
import { ConvertIDR } from "@/utils/ConvertIDR";

const InvoiceTable = dynamic(
  () => import("@/components/admin/invoice/InvoiceTable")
);
const ButtonLoading = dynamic(() => import("@/components/ButtonLoading"));

const Invoice = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params: { id: string } = useParams();

  const invoice: string = params.id;

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

  const { setting } = useGetSettingHook();

  if (!order) {
    return null;
  }

  const user = order.user;

  const date = new Date(order.createdAt);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(
        `/api/admin/invoice/${invoice}/download/get`,
        {
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob([res.data], { type: "image/png" });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice}.png`;
      link.click();

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

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
      <React.Fragment>
        <ToastContainer />
        <section className="admin__container">
          <div className="block">
            <div className="w-full flex justify-center">
              <div className="w-[595px] h-fit bg-primary-color overflow-hidden relative">
                <div className="w-full h-full px-10 pt-16 bg-white rounded-tl-[300px] relative">
                  <div className="w-full flex justify-center">
                    {setting && setting.image && setting.imagePathname ? (
                      <Image
                        src={setting.image}
                        alt={setting.imagePathname}
                        width={200}
                        height={200}
                        className="w-[100px] h-[100px] object-contain"
                        priority
                      />
                    ) : (
                      <ImageIcon width={100} height={100} />
                    )}
                  </div>

                  <div className="w-full grid grid-cols-2 mt-12 text-xs gap-3 ">
                    <div className="w-full mt-2">
                      <div className="font-semibold uppercase text-primary-color">
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
                      <div className="text-2xl uppercase leading-10">
                        Invoice
                      </div>
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
                      <div className="font-semibold uppercase mb-2 text-primary-color">
                        Note:
                      </div>
                      <div>{order.note}</div>
                    </div>

                    <div className="w-full">
                      {cost("Total", order.subTotal ? order.subTotal : 0)}
                      {cost("Tax", order.tax ? order.tax : 0)}
                      {cost("Shipping", order.shipping ? order.shipping : 0)}
                      {cost("Discount", order.discount ? order.discount : 0)}
                      <div className="w-full flex justify-end mb-2">
                        <div className="w-[210px] px-2 pt-2 pb-1 flex justify-between font-semibold text-sm bg-primary-color text-black">
                          Grand Total{" "}
                          <div>
                            {ConvertIDR(
                              order.grandTotal ? order.grandTotal : 0
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 text-xs mt-7 pb-16">
                    <div className="w-full">
                      <div className="uppercase font-semibold text-primary-color">
                        payment information
                      </div>
                      <div className="capitalize">
                        {setting && setting.bank}
                      </div>
                      <div className="capitalize">
                        account name: {setting && setting.bankName}
                      </div>
                      <div className="capitalize">
                        account number: {setting && setting.bankNumber}
                      </div>
                    </div>

                    <div className="w-full h-full flex justify-center items-center">
                      <div className="text-sm">Thank you!</div>
                    </div>
                  </div>
                </div>
                <div className="absolute w-full h-10 bottom-0 bg-primary-color z-50"></div>
              </div>
            </div>

            <div className="w-full flex justify-center mt-5">
              <Button size="sm" type="button" onClick={() => handleDownload()}>
                {isLoading ? <ButtonLoading /> : "Download"}
              </Button>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
};

export default Invoice;
