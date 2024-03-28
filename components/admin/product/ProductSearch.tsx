"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";

const ProductSearch = () => {
  const searchParams = useSearchParams();

  const searchValueParams = searchParams.get("search");

  const [search, setSearch] = useState<string>("");

  const router = useRouter();

  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((value: string) => {
    router.push(`${pathname}?search=${value}`);
  }, 1000);

  useEffect(() => {
    if (searchValueParams) {
      setSearch(searchValueParams);
    } else {
      setSearch("");
    }
  }, [searchValueParams]);

  return (
    <Input
      placeholder="Cari nama produk"
      value={search}
      className="w-[300px]"
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
    />
  );
};

export default ProductSearch;
