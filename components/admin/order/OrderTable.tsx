"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { MoreHorizontal } from "lucide-react";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { OrdersType } from "@/types/admin/OrderType";
import { ConvertDate } from "@/utils/ConvertDate";
import StatusOrder from "../StatusOrder";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "../Pagination";
import axios from "axios";
import { toast } from "react-toastify";

interface OrderTableProps {
  orders: OrdersType[];
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
  setIsLoadingContent: Dispatch<SetStateAction<boolean>>;
  totalPage: number;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  setIsLoadingPage,
  setIsLoadingContent,
  totalPage,
}) => {
  const router = useRouter();

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const handleRouterPagination = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.set("page", page.toString());

    router.push(`${pathName}?${current.toString()}`);
  };

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

  const handleRouterPush = (invoice: string, status: string) => {
    setIsLoadingPage(true);

    router.push(`/admin/orders/${invoice}`);

    if (status === "new") {
      handleStoreData(invoice);
    }
  };

  const handleStoreData = async (invoice: string) => {
    try {
      await axios.patch(`/api/admin/orders/${invoice}/status-order/patch`);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full">
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
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            handleRouterPush(order.invoice, order.statusOrder)
                          }
                        >
                          Detail
                        </DropdownMenuItem>
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

      <Pagination
        totalPage={totalPage}
        setIsLoadingContent={setIsLoadingContent}
        handleRouter={handleRouterPagination}
        pageParams={pageParams ? parseInt(pageParams) : 1}
      />
    </div>
  );
};

export default OrderTable;
