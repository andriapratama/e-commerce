"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  setIsLoadingContent: Dispatch<SetStateAction<boolean>>;
}

const OrderFilter: React.FC<Props> = ({ setIsLoadingContent }) => {
  const [search, setSearch] = useState<string>("");

  const [status, setStatus] = useState<string>("");

  const searchParams = useSearchParams();

  const searchValue = searchParams.get("search");
  const statusParams = searchParams.get("status");

  const pathName = usePathname();

  const router = useRouter();

  useEffect(() => {
    if (searchValue) {
      setSearch(searchValue);
    }

    if (statusParams) {
      setStatus(statusParams);
    }
  }, [searchValue, statusParams]);

  const handleSearch = useDebouncedCallback((value: string) => {
    router.push(`${pathName}?search=${value}`);
  }, 500);

  const handleSetStatus = (value: string) => {
    setStatus(value);
    setSearch("");

    router.push(`${pathName}?status=${value}&page=1`);
  };
  return (
    <div className="flex items-center py-4 gap-1">
      <Input
        placeholder="Cari no invoice..."
        value={search}
        className="!w-[200px]"
        onChange={(e) => {
          const value = e.target.value.toUpperCase();
          handleSearch(value);
          setSearch(value);
          setIsLoadingContent(true);
          setStatus("");
        }}
      />

      <Select value={status} onValueChange={handleSetStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="new">Baru</SelectItem>
            <SelectItem value="ongoing">Diproses</SelectItem>
            <SelectItem value="done">Selesai</SelectItem>
            <SelectItem value="cancel">Batal</SelectItem>
            <SelectItem value="all">Semua</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderFilter;
