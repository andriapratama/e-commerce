"use client";

import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";

import Pagination from "../Pagination";
import StatusProduct from "../StatusProduct";

interface ProductTableProps {
  products: AdminProductType[] | undefined;
  totalPage: number | undefined;
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  setIsLoadingPage,
  totalPage,
}) => {
  const router = useRouter();

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const categoryParams = searchParams.get("category");

  const subCategoryParams = searchParams.get("subCategory");

  const handleRouterPagination = (page: number) => {
    if (categoryParams && subCategoryParams) {
      router.push(
        `${pathName}?category=${categoryParams}&subCategory=${subCategoryParams}&page=${page}`
      );
    } else if (categoryParams) {
      router.push(`${pathName}?category=${categoryParams}&page=${page}`);
    } else {
      router.push(`${pathName}?page=${page}`);
    }
  };

  return (
    <div className="w-full">
      <Table className="bg-white rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="text-center w-[15%]">Kategori</TableHead>
            <TableHead className="text-center w-[15%]">Sub Kategori</TableHead>
            <TableHead>Harga Pokok</TableHead>
            <TableHead>Harga Jual</TableHead>
            <TableHead>Harga Sale</TableHead>
            <TableHead className="text-center w-[10%]">Stok</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products ? (
            products.map((product: AdminProductType) => (
              <TableRow key={product.slug}>
                <TableCell className="flex justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="object-contain h-[50px] w-auto"
                    priority
                  />
                </TableCell>
                <TableCell className="capitalize">{product.name}</TableCell>
                <TableCell className="capitalize text-center">
                  {product.category.name}
                </TableCell>
                <TableCell className="capitalize text-center">
                  {product.subCategory ? product.subCategory.name : "-"}
                </TableCell>
                <TableCell>{ConvertIDR(product.cost)}</TableCell>
                <TableCell>{ConvertIDR(product.price)}</TableCell>
                <TableCell className="text-red-600">
                  {product.status === "sale"
                    ? ConvertIDR(product.salePrice)
                    : ""}
                </TableCell>
                <TableCell className="text-center">
                  {product.totalStock}
                </TableCell>
                <TableCell className="text-center capitalize">
                  <StatusProduct status={product.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="w-full flex justify-center"
                    >
                      <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link
                        href={`/admin/products/detail?slug=${product.slug}`}
                      >
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setIsLoadingPage(true)}
                        >
                          Detail
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                Data kosong
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        totalPage={totalPage}
        pageParams={parseInt(pageParams ? pageParams : "1")}
        handleRouter={handleRouterPagination}
      />
    </div>
  );
};

export default ProductTable;
