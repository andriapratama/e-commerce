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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConvertDate } from "@/utils/ConvertDate";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { Button } from "@/components/ui/button";

interface ProductSaleLogType {
  sale: string;
  salePrice: number;
  note: string;
  createdAt: string;
  employee: { name: string };
}

interface ProductDetailSaleLogProps {
  saleList: ProductSaleLogType[];
}

const ProductDetailSaleLog: React.FC<ProductDetailSaleLogProps> = ({
  saleList,
}) => {
  return (
    <div className="w-full bg-white border rounded-md shadow-md mb-5">
      <h2 className="p-5 border-b font-semibold capitalize text-base">
        Histori Sale
      </h2>
      <Table className="bg-white rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-center">Status Sale</TableHead>
            <TableHead>Harga Sale</TableHead>
            <TableHead className="text-center">Catatan</TableHead>
            <TableHead className="text-center">Pegawai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saleList.length > 0 ? (
            saleList.map((value, index) => (
              <TableRow key={index}>
                <TableCell>{ConvertDate(value.createdAt)}</TableCell>
                <TableCell className="text-center capitalize">
                  {value.sale}
                </TableCell>
                <TableCell>{ConvertIDR(value.salePrice)}</TableCell>
                <TableCell className="text-center">
                  {!value.note ? (
                    "-"
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Buka
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Catatan</DialogTitle>
                          <DialogDescription>{value.note}</DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
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

export default ProductDetailSaleLog;
