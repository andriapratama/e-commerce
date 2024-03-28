"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { ProductMinStockType } from "@/types/ProductType";

const DashboardProductMinStock = () => {
  const router = useRouter();

  const fetcher: Fetcher<{
    data: ProductMinStockType[] | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data } = useSWR("/api/admin/products/min-stock/get", fetcher);

  if (data?.data) {
    return (
      <div className="w-full h-fit rounded-xl border shadow p-6 bg-white">
        <div className="font-medium mb-5">Sisa Stok Produk</div>

        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center w-[10%]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-contain w-[60px] h-[60px] cursor-pointer"
                    priority
                    onClick={() =>
                      router.push(`/admin/products/${product.slug}`)
                    }
                  />
                </TableCell>
                <TableCell className="capitalize">
                  <span
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() =>
                      router.push(`/admin/products/${product.slug}`)
                    }
                  >
                    {product.name}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {product.totalStock}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } else {
    return null;
  }
};

export default DashboardProductMinStock;
