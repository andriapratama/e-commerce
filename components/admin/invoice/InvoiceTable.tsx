"use client";

import React from "react";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { OrderDetailType } from "@/types/admin/OrderType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceTableProps {
  orderDetail: OrderDetailType[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ orderDetail }) => {
  return (
    <Table className="bg-white rounded-md mb-5 text-xs border-b border-gray-800">
      <TableHeader>
        <TableRow className="!border-gray-800 bg-orange-300 hover:!bg-orange-300">
          <TableHead className="!p-2 !h-8 !text-gray-800">Name</TableHead>
          <TableHead className="text-center !p-2 !h-8 !text-black">
            Price
          </TableHead>
          <TableHead className="text-center !p-2 !h-8 !text-black">
            Quantity
          </TableHead>
          <TableHead className="text-center !p-2 !h-8 !text-black">
            Sub Total
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderDetail.map((data: OrderDetailType) => (
          <TableRow key={data.name} className="!border-gray-800">
            <TableCell className="!p-2">{data.name}</TableCell>
            <TableCell className="text-center !p-2">
              {ConvertIDR(data.price)}
            </TableCell>
            <TableCell className="text-center !p-2">{data.quantity}</TableCell>
            <TableCell className="text-center !p-2">
              {ConvertIDR(data.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoiceTable;
