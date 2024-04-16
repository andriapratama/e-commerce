"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
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
import { FinanceLogType } from "@/types/admin/FianceLogType";
import { ConvertDate } from "@/utils/ConvertDate";
import { ConvertIDR } from "@/utils/ConvertIDR";

import ProductDetailShowNote from "./ProductDetailShowNote";

const ProductDetailFinanceLog = () => {
  const searchParams = useSearchParams();

  const slugParams = searchParams.get("slug");

  const fetcher: Fetcher<{
    data: FinanceLogType[] | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR(
    `/api/admin/products/${slugParams}/finance/get`,
    fetcher
  );

  return (
    <div className="w-full bg-white border rounded-md shadow-md mb-5">
      <h2 className="p-5 border-b font-semibold capitalize text-base">
        Histori Harga
      </h2>
      <Table className="bg-white rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Harga Jual</TableHead>
            <TableHead>Harga Pokok</TableHead>
            <TableHead className="text-center">Catatan</TableHead>
            <TableHead>Pegawai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data ? (
            data.data.map((value: FinanceLogType, index) => (
              <TableRow key={index}>
                <TableCell>{ConvertDate(value.createdAt)}</TableCell>
                <TableCell>{ConvertIDR(value.price)}</TableCell>
                <TableCell>{ConvertIDR(value.cost)}</TableCell>
                <TableCell className="text-center">
                  {!value.note ? (
                    "-"
                  ) : (
                    <ProductDetailShowNote note={value.note} />
                  )}
                </TableCell>
                <TableCell className="capitalize">
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

export default ProductDetailFinanceLog;
