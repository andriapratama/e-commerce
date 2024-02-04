"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { ProductSoldType } from "@/types/ProductType";
import Pagination from "../Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingGif from "@/components/LoadingGif";

interface Props {
  productsSold: ProductSoldType[];
  totalPage: number;
  isLoadingProductContent: boolean;
  setIsLoadingProductContent: Dispatch<SetStateAction<boolean>>;
}

const DashboardProductSold: React.FC<Props> = ({
  productsSold,
  totalPage,
  isLoadingProductContent,
  setIsLoadingProductContent,
}) => {
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

      {isLoadingProductContent ? (
        <div className="w-full flex justify-center py-3">
          <LoadingGif className="!h-6 w-6" />
        </div>
      ) : (
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center w-[10%]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsSold.map((product, index) => (
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
                  {product.total.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination
        totalPage={totalPage}
        setIsLoadingContent={setIsLoadingProductContent}
        handleRouter={handleRouterPagination}
        pageParams={pageParams ? parseInt(pageParams) : 1}
      />
    </div>
  );
};

export default DashboardProductSold;
