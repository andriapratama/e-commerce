"use client";

import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { MoreHorizontal } from "lucide-react";
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
import { AdminUserType } from "@/types/UserType";
import Pagination from "../Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  users: AdminUserType[];
  totalPage: number;
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
  setIsLoadingContent: Dispatch<SetStateAction<boolean>>;
}

const UserTable: React.FC<Props> = ({
  users,
  setIsLoadingPage,
  setIsLoadingContent,
  totalPage,
}) => {
  const router = useRouter();

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const handleRouterPagination = (page: number) => {
    router.push(`${pathName}?page=${page}`);
  };
  return (
    <React.Fragment>
      <Table className="bg-white rounded-md border">
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>No Hp</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user: AdminUserType, index) => (
              <TableRow key={index}>
                <TableCell className="capitalize">{`${user.firstName} ${user.lastName}`}</TableCell>
                <TableCell>
                  <Link
                    href={`mailto:${user.email}`}
                    target="_blank"
                    className="w-fit hover:border-b border-black"
                  >
                    {user.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`https://wa.me/${user.phone}`}
                    target="_blank"
                    className="w-fit hover:border-b border-black"
                  >
                    {user.phone}
                  </Link>
                </TableCell>
                <TableCell className="text-center capitalize">
                  {user.active === true ? "Aktif" : "Tidak Aktif"}
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
                      <Link href={`${pathName}/${user.id}`}>
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
        setIsLoadingContent={setIsLoadingContent}
        pageParams={parseInt(pageParams ? pageParams : "1")}
        handleRouter={handleRouterPagination}
      />
    </React.Fragment>
  );
};

export default UserTable;
