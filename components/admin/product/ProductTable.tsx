"use client";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConvertIDR } from "@/utils/ConvertIDR";
import Link from "next/link";
import { useState } from "react";
import { AdminProductType } from "@/types/ProductType";
import Image from "next/image";
import StatusProduct from "../StatusProduct";

interface ProductTableProps {
  products: AdminProductType[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [search, setSearch] = useState<string>("");
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama produk"
          value={search}
          className="max-w-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table className="bg-white rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center w-[15%]">Kategori</TableHead>
              <TableHead>Harga Pokok</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Harga Sale</TableHead>
              <TableHead className="text-center w-[10%]">Stok</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
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
                        <Link href={`/admin/products/${product.slug}`}>
                          <DropdownMenuItem className="cursor-pointer">
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
                <TableCell colSpan={8} className="h-24 text-center">
                  Data kosong
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductTable;
