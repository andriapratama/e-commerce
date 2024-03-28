"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderLogType } from "@/types/admin/OrderType";
import { ConvertDate } from "@/utils/ConvertDate";
import { ConvertTime } from "@/utils/ConvertTime";

interface OrderDetailLogProps {
  orderLogs: OrderLogType[];
}

const OrderDetailLog: React.FC<OrderDetailLogProps> = ({ orderLogs }) => {
  return (
    <div className="w-full bg-white border rounded-md shadow-md mb-5 mt-10">
      <h2 className="p-5 border-b font-semibold capitalize text-base">
        Histori Order
      </h2>
      <Table className="bg-white rounded-md text-base">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Tanggal</TableHead>
            <TableHead className="text-center">Waktu</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Pegawai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderLogs ? (
            orderLogs.map((orderLog: OrderLogType, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  {ConvertDate(orderLog.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  {ConvertTime(orderLog.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  {orderLog.status === "new"
                    ? "Order baru"
                    : orderLog.status === "open"
                    ? "Order dikonfirmasi"
                    : orderLog.status === "paid"
                    ? "Order dibayar"
                    : orderLog.status === "invoice"
                    ? "Invoice dikirim"
                    : orderLog.status === "delivery"
                    ? "Barang dikirim"
                    : orderLog.status === "accepted"
                    ? "Barang diterima"
                    : orderLog.status === "done"
                    ? "Proses order selesai"
                    : "Orderan batal"}
                </TableCell>
                <TableCell className="capitalize text-center">
                  {orderLog.employeeName}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Data Kosong
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderDetailLog;
