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
import { ConvertDate } from "@/utils/ConvertDate";
import { ConvertIDR } from "@/utils/ConvertIDR";
import ProductDetailShowNote from "./ProductDetailShowNote";

interface ProductStatusLogType {
  status: string;
  salePrice: number;
  note: string;
  createdAt: string;
  employee: { name: string };
}

interface ProductDetailStatusLogProps {
  statusList: ProductStatusLogType[];
}

const ProductDetailStatusLog: React.FC<ProductDetailStatusLogProps> = ({
  statusList,
}) => {
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
          {statusList.length > 0 ? (
            statusList.map((value, index) => (
              <TableRow key={index}>
                <TableCell>{ConvertDate(value.createdAt)}</TableCell>
                <TableCell className="text-center capitalize">
                  {value.status}
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
