"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import { OrderLogType, OrderType } from "@/types/admin/OrderType";

import WarningAlert from "../WarningAlert";
import OrderDetailEditTransaction from "./OrderDetailEditTransaction";

interface OrderDetailButtonProps {
  order: OrderType;
  orderLogs: OrderLogType[];
}

const OrderDetailButton: React.FC<OrderDetailButtonProps> = ({
  order,
  orderLogs,
}) => {
  const params: { id: string } = useParams();

  const invoice: string = params.id;

  const router = useRouter();

  const checkStatus = (status: string) => {
    if (orderLogs) {
      const res = orderLogs.find((val) => val.status === status);

      return res;
    }
  };

  const [isOpenPaymentStatus, setIsOpenPaymentStatus] =
    useState<boolean>(false);

  const [isOpenDelivery, setIsOpenDelivery] = useState<boolean>(false);

  const [isOpenAccepted, setIsOpenAccepted] = useState<boolean>(false);

  const [isOpenDone, setIsOpenDone] = useState<boolean>(false);

  const [isOpenSendInvoice, setIsOpenSendInvoice] = useState<boolean>(false);

  const [isOpenCancel, setIsOpenCancel] = useState<boolean>(false);

  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(false);

  const [isOpenEditTransaction, setIsOpenEditTransaction] =
    useState<boolean>(false);

  const { mutate } = useSWRConfig();

  const handleGetOrder = () => {
    mutate(`/api/admin/orders/${invoice}/order-detail/get`);
  };

  const handleChangePaymentStatus = async () => {
    try {
      setIsLoadingStore(true);

      await axios.patch(`/api/admin/orders/${invoice}/payment-status/patch`);

      handleGetOrder();

      toast.success("Status pembayaran telah diganti");

      setIsLoadingStore(false);
      setIsOpenPaymentStatus(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingStore(false);
    }
  };

  const handleDelivery = async () => {
    try {
      setIsLoadingStore(true);

      await axios.post(`/api/admin/orders/${invoice}/delivery/post`);

      handleGetOrder();

      toast.success("Barang telah dikirim");

      setIsOpenDelivery(false);
      setIsLoadingStore(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingStore(false);
    }
  };

  const handleAccepted = async () => {
    try {
      setIsLoadingStore(true);

      await axios.post(`/api/admin/orders/${invoice}/accepted/post`);

      handleGetOrder();

      toast.success("Barang telah diterima");

      setIsOpenAccepted(false);
      setIsLoadingStore(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingStore(false);
    }
  };

  const handleDone = async () => {
    try {
      setIsLoadingStore(true);

      await axios.post(`/api/admin/orders/${invoice}/done/post`);

      handleGetOrder();

      toast.success("Pesanan telah selesai");

      setIsOpenDone(false);
      setIsLoadingStore(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingStore(false);
    }
  };

  const handleSendInvoice = async () => {
    try {
      setIsLoadingStore(true);

      await axios.post(`/api/admin/invoice/${invoice}/post`);

      handleGetOrder();

      toast.success("Invoice telah dikirim");

      setIsOpenSendInvoice(false);
      setIsLoadingStore(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingStore(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsLoadingStore(true);

      await axios.post(`/api/admin/orders/${invoice}/cancel/post`);

      handleGetOrder();

      toast.success("Orderan telah dibatalkan");

      setIsOpenCancel(false);
      setIsLoadingStore(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingStore(false);
    }
  };

  const doneButton = () => {
    const resAccepted = checkStatus("accepted");
    const resDone = checkStatus("done");

    if (
      order.statuspayment === "paid" &&
      resAccepted?.status === "accepted" &&
      resDone === undefined
    ) {
      return <Button onClick={() => setIsOpenDone(true)}>Order Selesai</Button>;
    } else {
      return null;
    }
  };

  return (
    <React.Fragment>
      <div className="w-full gap-3 flex justify-end mt-5">
        {order.statuspayment === "pending" &&
        order.statusOrder === "ongoing" ? (
          <Button onClick={() => setIsOpenPaymentStatus(true)}>
            Ubah Status Pembayaran
          </Button>
        ) : null}

        {checkStatus("delivery") === undefined &&
        order.statusOrder === "ongoing" ? (
          <Button onClick={() => setIsOpenDelivery(true)}>
            Barang Dikirim
          </Button>
        ) : checkStatus("accepted") === undefined &&
          order.statusOrder === "ongoing" ? (
          <Button onClick={() => setIsOpenAccepted(true)}>
            Barang Diterima
          </Button>
        ) : null}

        {doneButton()}

        {checkStatus("delivery") === undefined &&
        order.statuspayment === "pending" &&
        order.statusOrder === "ongoing" ? (
          <Button onClick={() => setIsOpenEditTransaction(true)}>
            Masukkan biaya lainnya
          </Button>
        ) : null}

        {checkStatus("done") === undefined &&
        order.statusOrder === "ongoing" ? (
          <Button onClick={() => setIsOpenSendInvoice(true)}>
            Kirim Invoice
          </Button>
        ) : null}

        <Button
          onClick={() => {
            router.push(`/admin/invoice/${invoice}`);
          }}
        >
          Lihat Invoice
        </Button>

        {order.statusOrder === "done" ||
        order.statusOrder === "cancel" ? null : (
          <Button onClick={() => setIsOpenCancel(true)} variant="destructive">
            Orderan Batal
          </Button>
        )}
      </div>

      <OrderDetailEditTransaction
        isOpen={isOpenEditTransaction}
        setIsOpen={setIsOpenEditTransaction}
        subTotal={order.subTotal ? order.subTotal : 0}
        tax={order.tax ? order.tax : 0}
        shipping={order.shipping}
        discount={order.discount}
        grandTotal={order.grandTotal ? order.grandTotal : 0}
      />

      <WarningAlert
        isOpen={isOpenPaymentStatus}
        setIsOpen={setIsOpenPaymentStatus}
        isLoading={isLoadingStore}
        handleStoreData={handleChangePaymentStatus}
        title="Apakah barang sudah dibayar?"
      />

      <WarningAlert
        isOpen={isOpenDelivery}
        setIsOpen={setIsOpenDelivery}
        isLoading={isLoadingStore}
        handleStoreData={handleDelivery}
        title="Apakah barang sudah dikirim?"
      />

      <WarningAlert
        isOpen={isOpenAccepted}
        setIsOpen={setIsOpenAccepted}
        isLoading={isLoadingStore}
        handleStoreData={handleAccepted}
        title="Apakah barang sudah diterima?"
      />

      <WarningAlert
        isOpen={isOpenDone}
        setIsOpen={setIsOpenDone}
        isLoading={isLoadingStore}
        handleStoreData={handleDone}
        title="Apakah order sudah selesai?"
      />

      <WarningAlert
        isOpen={isOpenSendInvoice}
        setIsOpen={setIsOpenSendInvoice}
        isLoading={isLoadingStore}
        handleStoreData={handleSendInvoice}
        title="Invoice akan dikirim melalui email. Apakah anda yakin mengirim invoice?"
      />

      <WarningAlert
        isOpen={isOpenCancel}
        setIsOpen={setIsOpenCancel}
        isLoading={isLoadingStore}
        handleStoreData={handleCancel}
        title="Apakah orderan dibatalkan?"
      />
    </React.Fragment>
  );
};

export default OrderDetailButton;
