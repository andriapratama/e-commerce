"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React from "react";
import useSWR, { Fetcher } from "swr";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockLogType } from "@/types/admin/StockLogType";
import { ConvertDate } from "@/utils/ConvertDate";

import ProductDetailShowNote from "./ProductDetailShowNote";

interface Stock extends StockLogType {
  invoice?: string;
}

const ProductDetailStockLog = () => {
  const params = useParams();

  const slugParams = params.id;

  const fetcher: Fetcher<{
    data: Stock[] | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR(
    `/api/admin/products/${slugParams}/stock/get`,
    fetcher
  );

  return (
    <div className="w-full bg-white border rounded-md shadow-md mb-5">
      <h2 className="p-5 border-b font-semibold capitalize text-base">
        Histori Stok
      </h2>
      <Table className="bg-white rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-center">Stok Sebelumnya</TableHead>
            <TableHead className="text-center">Jumlah Stok</TableHead>
            <TableHead className="text-center">Stok Skarang</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Catatan</TableHead>
            <TableHead className="text-center">Pegawai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data ? (
            data.data.map((value: Stock, index) => (
              <TableRow key={index}>
                <TableCell>{ConvertDate(value.createdAt)}</TableCell>
                <TableCell className="text-center">
                  {value.previousStock}
                </TableCell>
                <TableCell className="text-center">{value.stock}</TableCell>
                <TableCell className="text-center">{value.stockNow}</TableCell>
                <TableCell className="capitalize text-center">
                  {value.status === "first"
                    ? "baru"
                    : value.status === "update"
                    ? "Diubah"
                    : value.status === "decrease"
                    ? "Dikurang"
                    : "Ditambah"}
                </TableCell>
                <TableCell className="text-center">
                  {!value.note ? (
                    "-"
                  ) : (
                    <ProductDetailShowNote
                      note={value.note}
                      invoice={value.invoice}
                    />
                  )}
                </TableCell>
                <TableCell className="capitalize text-center">
                  {value.employee.name}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Data Kosong
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductDetailStockLog;
