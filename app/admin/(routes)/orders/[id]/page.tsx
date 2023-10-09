"use client";

import OrderDetailInfo from "@/components/admin/order-detail/OrderDetailInfo";
import OrderDetailCard from "@/components/admin/order-detail/OrderDetailCard";
import OrderDetailTable from "@/components/admin/order-detail/OrderDetailTable";
import Title from "@/components/admin/Title";
import { Button } from "@/components/ui/button";
import React from "react";

import OrderDetailInputShipping from "@/components/admin/order-detail/OrderDetailInputShipping";
import OrderDetailChangePayment from "@/components/admin/order-detail/OrderDetailChangePayment";

const OrderDetail = () => {
  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <Title title="Detail Order" noInvoice="#20231006001" />

        <div className="flex flex-wrap gap-4 justify-center">
          <OrderDetailCard title="Pelanggan">
            <div>Jhon Doe</div>
            <div>jhondoen@mail.com</div>
            <div>03239432932</div>
          </OrderDetailCard>
          <OrderDetailCard title="Dikirim ke">
            <div className="text-capitalize">
              Jlan Kusuma Negara, Kuta, Bali Indonesia
            </div>
            <div>Villa punya saya</div>
          </OrderDetailCard>
          <OrderDetailCard title="Pesan">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
              quo corrupti
            </p>
          </OrderDetailCard>
          <OrderDetailCard title="Tanggal pesan & Pembayaran">
            <div>2:30AM,</div>
            <div>Kamis, 3 Oktober 2023</div>
            <div>Tunai</div>
          </OrderDetailCard>

          <div className="bg-white rounded-md shadow-md w-full p-7 mt-10">
            <OrderDetailTable />

            <OrderDetailInfo name="Tax" value={0} />
            <OrderDetailInfo name="Shipping" value={40000} />
            <OrderDetailInfo name="Dicount" value={0} />
            <OrderDetailInfo name="Total" value={3000000} />
            <OrderDetailInfo name="Status Pembayaran" status="Belum Dibayar" />

            <div className="w-full gap-3 flex justify-end mt-5">
              <OrderDetailChangePayment />
              <OrderDetailInputShipping />
              <Button className="rounded-full">Lihat Invoice</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetail;
