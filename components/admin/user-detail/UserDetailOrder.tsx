"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConvertDate } from "@/utils/ConvertDate";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { AdminUserOrderType } from "@/types/UserType";
import { StatusPayment } from "../StatusPayment";
import StatusOrder from "../StatusOrder";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Pagination from "../Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  orders: AdminUserOrderType[];
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
  setIsLoadingOrderContent: Dispatch<SetStateAction<boolean>>;
  totalPage: number;
}

const UserDetailOrder: React.FC<Props> = ({
  orders,
  setIsLoadingPage,
  setIsLoadingOrderContent,
  totalPage,
}) => {
  const router = useRouter();

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const handleRouterPagination = (page: number) => {
    router.push(`${pathName}?page=${page}`);
  };

  return (
    <div className="w-full bg-white border rounded-md shadow-md mt-5">
      <h2 className="p-5 border-b font-semibold capitalize text-base">
        Histori Order
      </h2>
      <Table className="bg-white rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Invoice</TableHead>
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
            orders.map((order: AdminUserOrderType, index) => (
              <TableRow key={index}>
                <TableCell>{ConvertDate(order.createdAt.toString())}</TableCell>
                <TableCell>{order.invoice}</TableCell>
                <TableCell className="text-center">{order.totalItem}</TableCell>
                <TableCell>{ConvertIDR(order.grandTotal)}</TableCell>
                <TableCell className="capitalize text-center">
                  {order.paymentMethod === "cash" ? "Tunai" : "Transfer"}
                </TableCell>
                <TableCell className="text-center capitalize">
                  {StatusPayment(order.statuspayment)}
                </TableCell>
                <TableCell className="text-center">
                  {StatusOrder(order.statusOrder)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="w-full flex justify-center"
                    >
                      <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/admin/orders/${order.invoice}`}>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setIsLoadingPage(true)}
                        >
                          Buka
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Data Kosong
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mb-5">
        <Pagination
          totalPage={totalPage}
          setIsLoadingContent={setIsLoadingOrderContent}
          handleRouter={handleRouterPagination}
          pageParams={pageParams ? parseInt(pageParams) : 1}
        />
      </div>
    </div>
  );
};

export default UserDetailOrder;
