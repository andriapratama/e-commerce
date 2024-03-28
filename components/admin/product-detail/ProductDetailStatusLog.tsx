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
import { StatusLogType } from "@/types/admin/StatusLogType";
import { ConvertDate } from "@/utils/ConvertDate";
import { ConvertIDR } from "@/utils/ConvertIDR";

import StatusProduct from "../StatusProduct";
import ProductDetailShowNote from "./ProductDetailShowNote";

const ProductDetailStatusLog = () => {
  const params = useParams();

  const slugParams = params.id;

  const fetcher: Fetcher<{
    data: StatusLogType[] | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR(
    `/api/admin/products/${slugParams}/status/get`,
    fetcher
  );

  return (
    <div className="w-full bg-white border rounded-md shadow-md mb-5">
      <h2 className="p-5 border-b font-semibold capitalize text-base">
        Histori Status
      </h2>
      <Table className="bg-white rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Harga Sale</TableHead>
            <TableHead className="text-center">Catatan</TableHead>
            <TableHead className="text-center">Pegawai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data ? (
            data.data.map((value: StatusLogType, index) => (
              <TableRow key={index}>
                <TableCell>{ConvertDate(value.createdAt)}</TableCell>
                <TableCell className="text-center capitalize">
                  <StatusProduct status={value.status} />
                </TableCell>
                <TableCell>{ConvertIDR(value.salePrice)}</TableCell>
                <TableCell className="text-center">
                  {!value.note ? (
                    "-"
                  ) : (
                    <ProductDetailShowNote note={value.note} />
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

export default ProductDetailStatusLog;
