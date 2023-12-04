"use client";

import axios from "axios";
import { toast } from "react-toastify";
import React, { Dispatch, SetStateAction, useState } from "react";
import WarningAlert from "../WarningAlert";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrderLogType, OrderType } from "@/types/admin/OrderType";
import OrderDetailEditTransaction from "./OrderDetailEditTransaction";

interface OrderDetailButtonProps {
  order: OrderType;
  getOrder: () => void;
  orderLogs: OrderLogType[];
  setIsLoadingContent: Dispatch<SetStateAction<boolean>>;
}

const OrderDetailButton: React.FC<OrderDetailButtonProps> = ({
  order,
  getOrder,
  orderLogs,
  setIsLoadingContent,
}) => {
  const params: { id: string } = useParams();

  const invoice: string = params.id;

  const router = useRouter();

  const checkStatus = (status: string) => {
    const res = orderLogs.find((val) => val.status === status);

    return res;
  };

  const [isOpenPaymentStatus, setIsOpenPaymentStatus] =
    useState<boolean>(false);

  const [isOpenDelivery, setIsOpenDelivery] = useState<boolean>(false);

  const [isOpenAccepted, setIsOpenAccepted] = useState<boolean>(false);

  const [isOpenDone, setIsOpenDone] = useState<boolean>(false);

  const [isOpenSendInvoice, setIsOpenSendInvoice] = useState<boolean>(false);

  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(false);

  const [isOpenEditTransaction, setIsOpenEditTransaction] =
    useState<boolean>(false);

  const handleChangePaymentStatus = async () => {
    try {
      setIsLoadingStore(true);

      await axios.patch(`/api/admin/orders/${invoice}/payment-status/patch`);

      getOrder();

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

      getOrder();

      toast.success("Pesanan telah dikirim");

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

      getOrder();

      toast.success("Pesanan telah diterima");

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

      getOrder();

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

      getOrder();

      toast.success("Invoice telah dikirim");

      setIsOpenSendInvoice(false);
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
      return (
        <Button onClick={() => setIsOpenDone(true)}>Pesanan Selesai</Button>
      );
    } else {
      return null;
    }
  };
  return (
    <React.Fragment>
      <div className="w-full gap-3 flex justify-end mt-5">
        {order.statuspayment === "pending" ? (
          <Button onClick={() => setIsOpenPaymentStatus(true)}>
            Ubah Status Pembayaran
          </Button>
        ) : null}
        {checkStatus("delivery") === undefined ? (
          <Button onClick={() => setIsOpenDelivery(true)}>
            Pesanan Dikirim
          </Button>
        ) : checkStatus("accepted") === undefined ? (
          <Button onClick={() => setIsOpenAccepted(true)}>
            Pesanan Diterima
          </Button>
        ) : null}

        {doneButton()}

        {checkStatus("invoice") === undefined ? (
          <Button onClick={() => setIsOpenEditTransaction(true)}>
            Masukkan biaya lainnya
          </Button>
        ) : null}

        {checkStatus("done") === undefined ? (
          <Button onClick={() => setIsOpenSendInvoice(true)}>
            Kirim Invoice
          </Button>
        ) : null}

        <Button
          onClick={() => {
            router.push(`/admin/invoice/${invoice}`);
            setIsLoadingContent(true);
          }}
        >
          Lihat Invoice
        </Button>
      </div>

      <OrderDetailEditTransaction
        isOpen={isOpenEditTransaction}
        setIsOpen={setIsOpenEditTransaction}
        subTotal={order.subTotal}
        tax={order.tax}
        shipping={order.shipping}
        discount={order.discount}
        grandTotal={order.grandTotal}
        getOrder={getOrder}
      />

      <WarningAlert
        isOpen={isOpenPaymentStatus}
        setIsOpen={setIsOpenPaymentStatus}
        isLoading={isLoadingStore}
        handleStoreData={handleChangePaymentStatus}
        title="Apakah pesanan sudah dibayar?"
      />

      <WarningAlert
        isOpen={isOpenDelivery}
        setIsOpen={setIsOpenDelivery}
        isLoading={isLoadingStore}
        handleStoreData={handleDelivery}
        title="Apakah pesanan sudah dikirim?"
      />

      <WarningAlert
        isOpen={isOpenAccepted}
        setIsOpen={setIsOpenAccepted}
        isLoading={isLoadingStore}
        handleStoreData={handleAccepted}
        title="Apakah pesanan sudah diterima?"
      />

      <WarningAlert
        isOpen={isOpenDone}
        setIsOpen={setIsOpenDone}
        isLoading={isLoadingStore}
        handleStoreData={handleDone}
        title="Apakah pesanan sudah selesai?"
      />

      <WarningAlert
        isOpen={isOpenSendInvoice}
        setIsOpen={setIsOpenSendInvoice}
        isLoading={isLoadingStore}
        handleStoreData={handleSendInvoice}
        title="Seletah invoice dikirim maka biaya lainnya tidak dapat diubah. Apakah anda yakin mengirim invoice?"
      />
    </React.Fragment>
  );
};

export default OrderDetailButton;
