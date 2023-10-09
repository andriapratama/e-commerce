"use client";

import Title from "@/components/admin/Title";
import CategoryEdit from "@/components/admin/category/CategoryEdit";
import CategoryInput from "@/components/admin/category/CategoryInput";
import CategoryTable from "@/components/admin/category/CategoryTable";
import React, { useState } from "react";

interface OrderData {
  id: string;
  name: string;
}

const _data: OrderData[] = [
  {
    id: "1",
    name: "Gin",
  },
  {
    id: "2",
    name: "Rum",
  },
  {
    id: "3",
    name: "Tequila",
  },
];

const Categories = () => {
  const [editValue, setEditValue] = useState<string>("");
  return (
    <section className="admin__container min-h-screen">
      <div className="admin__container-body">
        <Title title="Kategori" />
        <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
          {editValue ? (
            <CategoryEdit editValue={editValue} setEditValue={setEditValue} />
          ) : (
            <CategoryInput />
          )}
          <CategoryTable
            data={_data}
            editValue={editValue}
            setEditValue={setEditValue}
          />
        </div>
      </div>
    </section>
  );
};

export default Categories;
