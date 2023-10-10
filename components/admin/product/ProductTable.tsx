"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { ProductType } from "@/types/ProductType";
import Image from "next/image";

interface ProductTableProps {
  data: ProductType[];
}

const ProductTable: React.FC<ProductTableProps> = ({ data }) => {
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
              <TableHead>Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center">Kategori</TableHead>
              <TableHead>Harga Pokok</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Sale</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              data.map((value: ProductType) => (
                <TableRow key={value.id}>
                  <TableCell>
                    <Image
                      src={`/${value.image}`}
                      alt={value.name}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </TableCell>
                  <TableCell className="capitalize">{value.name}</TableCell>
                  <TableCell className="capitalize text-center">
                    {value.category}
                  </TableCell>
                  <TableCell>{ConvertIDR(value.cost)}</TableCell>
                  <TableCell>{ConvertIDR(value.price)}</TableCell>
                  <TableCell className="text-center">{value.stock}</TableCell>
                  <TableCell className="text-center capitalize">
                    {value.status}
                  </TableCell>
                  <TableCell className="text-center">{value.sale}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className="w-full flex justify-center"
                      >
                        <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/products/${value.id}`}>
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
                <TableCell colSpan={9} className="h-24 text-center">
                  No results.
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
