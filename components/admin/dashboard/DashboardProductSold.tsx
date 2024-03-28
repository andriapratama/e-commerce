"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductSoldType } from "@/types/ProductType";

import Pagination from "../Pagination";

interface Props {
  productsSold: ProductSoldType[] | undefined;
  totalPage: number | undefined;
}

const DashboardProductSold: React.FC<Props> = ({ productsSold, totalPage }) => {
  const router = useRouter();

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("product-page");

  const handleRouterPagination = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.set("product-page", page.toString());

    router.push(`${pathName}?${current.toString()}`);
  };

  return (
    <div className="w-full h-fit rounded-xl border shadow p-6 bg-white">
      <div className="font-medium mb-5">Total Barang Terjual</div>

      <Table className="bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[10%]">Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="text-center w-[10%]">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productsSold?.map((product, index) => (
            <TableRow key={index}>
              <TableCell>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain w-[60px] h-[60px] cursor-pointer"
                  priority
                  onClick={() => router.push(`/admin/products/${product.slug}`)}
                />
              </TableCell>
              <TableCell className="capitalize">
                <span
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => router.push(`/admin/products/${product.slug}`)}
                >
                  {product.name}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {product.total.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        totalPage={totalPage}
        handleRouter={handleRouterPagination}
        pageParams={pageParams ? parseInt(pageParams) : 1}
      />
    </div>
  );
};

export default DashboardProductSold;
