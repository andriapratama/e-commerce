"use client";

import { CategoryType } from "@/types/CategoryType";
import React, { useState } from "react";
import CategoryEdit from "./CategoryEdit";
import CategoryInput from "./CategoryInput";
import CategoryTable from "./CategoryTable";

interface CategoryContentProps {
  username?: string;
  categories: CategoryType[];
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  username,
  categories,
}) => {
  const [editCategory, setEditCategory] = useState<CategoryType>({
    name: "",
    slug: "",
  });
  return (
    <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
      {editCategory.name ? (
        <CategoryEdit
          username={username}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
        />
      ) : (
        <CategoryInput username={username} />
      )}
      <CategoryTable
        categories={categories}
        setEditCategory={setEditCategory}
      />
    </div>
  );
};

export default CategoryContent;
