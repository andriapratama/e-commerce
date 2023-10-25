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
import { Button } from "@/components/ui/button";
import { ConvertDate } from "@/utils/ConvertDate";
import { ConvertIDR } from "@/utils/ConvertIDR";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductFinanceLogType {
  price: number;
  cost: number;
  note: string;
  createdAt: string;
  employee: { name: string };
}

interface ProductDetailFinanceLogProps {
  financeList: ProductFinanceLogType[];
}

const ProductDetailFinanceLog: React.FC<ProductDetailFinanceLogProps> = ({
  financeList,
}) => {
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
            <TableHead>Catatan</TableHead>
            <TableHead>Pegawai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {financeList.length > 0 ? (
            financeList.map((value: ProductFinanceLogType, index) => (
              <TableRow key={index}>
                <TableCell>{ConvertDate(value.createdAt)}</TableCell>
                <TableCell>{ConvertIDR(value.price)}</TableCell>
                <TableCell>{ConvertIDR(value.cost)}</TableCell>
                <TableCell>
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
