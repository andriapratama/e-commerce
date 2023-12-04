"use client";

import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { OrdersType } from "@/types/admin/OrderType";
import { ConvertDate } from "@/utils/ConvertDate";
import StatusOrder from "../StatusOrder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderTableProps {
  orders: OrdersType[];
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  setIsLoadingPage,
}) => {
  const [search, setSearch] = useState<string>("");

  const StatusPayment = (status: "pending" | "paid") => {
    return (
      <div
        className={`px-5 py-3 rounded-full ${
          status === "pending"
            ? "bg-black text-white"
            : "bg-white border border-black text-black"
        }`}
      >
        {status === "pending" ? "belum dibayar" : "selesai"}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari no invoice..."
          value={search}
          className="max-w-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table className="bg-white rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal Order</TableHead>
              <TableHead>No Invoice</TableHead>
              <TableHead className="w-[20%]">Pelanggan</TableHead>
              <TableHead className="text-center">Item</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead className="text-center">Pembayaran</TableHead>
              <TableHead className="text-center">Status Pembayaran</TableHead>
              <TableHead className="text-center">Status Order</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: OrdersType) => (
                <TableRow key={order.invoice}>
                  <TableCell>{ConvertDate(order.createdAt)}</TableCell>
                  <TableCell>{order.invoice}</TableCell>
                  <TableCell className="flex flex-wrap gap-1">
                    <div className="w-full">{order.userName}</div>
                    <div className="w-full">
                      <Link
                        href={`mailto:${order.userEmail}`}
                        target="_blank"
                        className="w-fit hover:border-b border-black"
                      >
                        {order.userEmail}
                      </Link>
                    </div>
                    <div className="w-full">
                      <Link
                        href={`https://web.whatsapp.com/send/?phone=%2B${order.userPhone}&text&type=phone_number&app_absent=0`}
                        target="_blank"
                        className="w-fit hover:border-b border-black"
                      >
                        {order.userPhone}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {order.totalItem}
                  </TableCell>
                  <TableCell>{ConvertIDR(order.grandTotal)}</TableCell>
                  <TableCell className="text-center capitalize">
                    {order.paymentMethod === "cash" ? "tunai" : "transfer"}
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    {StatusPayment(order.statuspayment)}
                  </TableCell>
                  <TableCell className="text-center">
                    {StatusOrder(order.statusOrder)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="w-full flex justify-center">
                          <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/orders/${order.invoice}`}>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setIsLoadingPage(true)}
                          >
                            Detail
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
