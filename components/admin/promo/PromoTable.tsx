"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

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
import { PromoType } from "@/types/PromoType";
import { ConvertDate } from "@/utils/ConvertDate";

interface PromoTableProps {
  promos: PromoType[];
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
}

const PromoTable: React.FC<PromoTableProps> = ({
  promos,
  setIsLoadingPage,
}) => {
  return (
    <Table className="bg-white rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-[7%]">#</TableHead>
          <TableHead className="w-[15%]">Tanggal</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promos.length > 0 ? (
          promos.map((promo: PromoType, index) => (
            <TableRow key={promo.slug}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="capitalize">
                {ConvertDate(promo.createdAt.toLocaleDateString())}
              </TableCell>
              <TableCell className="capitalize">{promo.name}</TableCell>
              <TableCell className="text-center capitalize">
                <div
                  className={`px-4 py-3 font-medium rounded-full ${
                    promo.status === "active"
                      ? "bg-white border border-black text-black"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {promo.status === "active" ? "Aktif" : "Arsip"}
                </div>
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
                    <Link href={`/admin/promos/${promo.slug}`}>
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
            <TableCell colSpan={4} className="h-24 text-center">
              Data kosong
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PromoTable;
