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
import { EmployeeType } from "@/types/admin/EmployeeType";

interface EmployeeTableProps {
  employees: EmployeeType[] | undefined;
  setEditEmployee: Dispatch<SetStateAction<EmployeeType>>;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  setEditEmployee,
}) => {
  return (
    <div className="admin__card w-full">
      <Table className="h-full">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        {employees ? (
          <TableBody>
            {employees.map((employee, index) => (
              <TableRow key={employee.username}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="capitalize">{employee.name}</TableCell>
                <TableCell>{employee.username}</TableCell>
                <TableCell className="capitalize">{employee.role}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          setEditEmployee({
                            name: employee.name,
                            username: employee.username,
                            role: employee.role,
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
                colSpan={4}
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

export default EmployeeTable;
