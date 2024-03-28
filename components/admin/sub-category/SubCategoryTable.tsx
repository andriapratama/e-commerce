"use client";

import { MoreHorizontal } from "lucide-react";
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
import { SubCategoryType } from "@/types/CategoryType";

interface Props {
  subCategories: SubCategoryType[] | undefined;
  setEditData: Dispatch<SetStateAction<SubCategoryType>>;
}

const SubCategoryTable: React.FC<Props> = ({ subCategories, setEditData }) => {
  return (
    <div className="admin__card w-full mt-10">
      <Table className="h-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">#</TableHead>
            <TableHead className="text-center">Kategori</TableHead>
            <TableHead className="text-center">Sub Kategori</TableHead>
            <TableHead className="text-center">Sub Kategori Slug</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        {subCategories ? (
          <TableBody>
            {subCategories.map((subCategory, index) => (
              <TableRow key={subCategory.name}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="capitalize text-center">
                  {subCategory.category.name}
                </TableCell>
                <TableCell className="capitalize text-center">
                  {subCategory.name}
                </TableCell>
                <TableCell className="text-center">
                  {subCategory.slug}
                </TableCell>
                <TableCell className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setEditData({
                            name: subCategory.name,
                            slug: subCategory.slug,
                            category: {
                              name: subCategory.category.name,
                              slug: subCategory.category.slug,
                            },
                          })
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center font-semibold text-lg text-gray-700"
              >
                Data kosong
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default SubCategoryTable;
