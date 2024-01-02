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
import { ConvertIDR } from "@/utils/ConvertIDR";
import { PromoProductType } from "@/types/PromoType";
import Image from "next/image";

interface Props {
  title: string;
  products: PromoProductType[];
}

const PromoDetailProductsTable: React.FC<Props> = ({ products, title }) => {
  return (
    <div className="admin__card w-full h-max my-5">
      <h2 className="admin-promo-detail-table__title">{title}</h2>
      <Table className="bg-white rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">#</TableHead>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead className="text-center">Jumlah</TableHead>
            <TableHead>Sub Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product: PromoProductType, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="flex justify-center">
                  <Image
                    src={product.product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="object-contain h-[50px] w-auto"
                    priority
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{ConvertIDR(product.price)}</TableCell>
                <TableCell className="text-center">
                  {product.quantity}
                </TableCell>
                <TableCell>{ConvertIDR(product.subTotal)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Data Kosong
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PromoDetailProductsTable;
