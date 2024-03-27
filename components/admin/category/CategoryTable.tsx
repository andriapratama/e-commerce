"use client";

import { MoreHorizontal } from "lucide-react";
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
import { CategoryType } from "@/types/CategoryType";

interface CategoryTableProps {
  categories: CategoryType[] | undefined;
  setEditCategory: Dispatch<SetStateAction<CategoryType>>;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  setEditCategory,
  categories,
}) => {
  return (
    <div className="admin__card w-full">
      <Table className="h-full">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        {!categories ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center font-semibold text-lg text-gray-700"
              >
                Data kosong
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.name}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="capitalize">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setEditCategory({
                            name: category.name,
                            slug: category.slug,
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
        )}
      </Table>
    </div>
  );
};

export default CategoryTable;
