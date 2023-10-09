"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import Link from "next/link";
import { useState } from "react";

interface Orders {
  noInvoice: string;
  name: string;
  email: string;
  phone: string;
  item: number;
  totalPrice: number;
  payment: "tunai" | "transfer";
  status: "baru" | "belum dibayar" | "selesai" | "batal";
  date: string;
}

const data: Orders[] = [
  {
    noInvoice: "20231005001",
    name: "Ken",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "tunai",
    status: "baru",
    email: "ken99@yahoo.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005002",
    name: "Abe",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "tunai",
    status: "belum dibayar",
    email: "Abe45@gmail.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005003",
    name: "Monserrat",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "transfer",
    status: "selesai",
    email: "Monserrat44@gmail.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005004",
    name: "Siklas",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "transfer",
    status: "selesai",
    email: "Silas22@gmail.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005005",
    name: "Carmella",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "tunai",
    status: "batal",
    email: "carmella@hotmail.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005006",
    name: "Carmella",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "tunai",
    status: "batal",
    email: "carmella@hotmail.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005007",
    name: "Carmella",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "tunai",
    status: "batal",
    email: "carmella@hotmail.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005008",
    name: "Carmella",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "tunai",
    status: "batal",
    email: "carmella@hotmail.com",
    date: "2023-10-6",
  },
  {
    noInvoice: "20231005009",
    name: "Carmella",
    phone: "082738729832",
    item: 5,
    totalPrice: 1240000,
    payment: "tunai",
    status: "batal",
    email: "carmella@hotmail.com",
    date: "2023-10-6",
  },
];

const OrderTable = () => {
  const [search, setSearch] = useState<string>("");
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
              <TableHead>No Invoice</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>No HP</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Total Harga</TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal Order</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              data.map((order: Orders) => (
                <TableRow key={order.noInvoice}>
                  <TableCell>{order.noInvoice}</TableCell>
                  <TableCell className="block">
                    {order.name} <br />
                    {order.email}
                  </TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.item}</TableCell>
                  <TableCell>{ConvertIDR(order.totalPrice)}</TableCell>
                  <TableCell className="text-center capitalize">
                    {order.payment}
                  </TableCell>
                  <TableCell className="text-center">
                    <div
                      className={`px-4 py-2 rounded-full flex justify-center items-center capitalize text-white ${
                        order.status === "baru"
                          ? "bg-sky-400"
                          : order.status === "belum dibayar"
                          ? "bg-yellow-400"
                          : order.status === "selesai"
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    >
                      {order.status}
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/orders/${order.noInvoice}`}>
                          <DropdownMenuItem className="cursor-pointer">
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
