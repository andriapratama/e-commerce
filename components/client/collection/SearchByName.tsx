"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";

const SearchByName = () => {
  const [name, setName] = useState<string>("");

  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-1 pr-2 border rounded-md">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search product"
          className="!border-none !flex-1"
        />
        <Search width={20} height={20} />
      </div>
    </div>
  );
};

export default SearchByName;
