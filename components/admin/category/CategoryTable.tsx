"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface OrderDetailTableProps {
  data: {
    id: string;
    name: string;
  }[];
  editValue: string;
  setEditValue: (editValue: string) => void;
}

const CategoryTable: React.FC<OrderDetailTableProps> = ({
  data,
  editValue,
  setEditValue,
}) => {
  return (
    <div className="admin__card w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((value, index) => (
            <TableRow key={value.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{value.name}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setEditValue(value.name)}
                    >
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
