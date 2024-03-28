"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryType, SubCategoryType } from "@/types/CategoryType";
import { AdminProductType } from "@/types/ProductType";

import ProductEditData from "./ProductEditData";
import ProductEditFinance from "./ProductEditFinance";
import ProductEditImage from "./ProductEditImage";
import ProductEditStatus from "./ProductEditStatus";
import ProductEditStock from "./ProductEditStock";

interface ProductEditButtonProps {
  product: AdminProductType;
  categories: CategoryType[] | undefined;
  subCategories: SubCategoryType[] | undefined;
}

const ProductEditButton: React.FC<ProductEditButtonProps> = ({
  product,
  categories,
  subCategories,
}) => {
  const [isOpenEditData, setIsOpenEditData] = useState<boolean>(false);
  const [isOpenEditFinance, setIsOpenEditFinance] = useState<boolean>(false);
  const [isOpenEditStock, setIsOpenEditStock] = useState<boolean>(false);
  const [isOpenEditStatus, setIsOpenEditStatus] = useState<boolean>(false);
  const [isOpenEditImage, setIsOpenEditImage] = useState<boolean>(false);
  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">Edit</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenEditData(true)}
          >
            Data Produk
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenEditFinance(true)}
          >
            Harga Jual & Harga Pokok
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenEditStock(true)}
          >
            Total Stok
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenEditStatus(true)}
          >
            Status
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenEditImage(true)}
          >
            Gambar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductEditData
        isOpen={isOpenEditData}
        setIsOpen={setIsOpenEditData}
        product={product}
        categories={categories}
        subCategories={subCategories}
      />

      <ProductEditFinance
        isOpen={isOpenEditFinance}
        setIsOpen={setIsOpenEditFinance}
        product={product}
      />

      <ProductEditStock
        isOpen={isOpenEditStock}
        setIsOpen={setIsOpenEditStock}
      />

      <ProductEditStatus
        isOpen={isOpenEditStatus}
        setIsOpen={setIsOpenEditStatus}
        product={product}
      />

      <ProductEditImage
        isOpen={isOpenEditImage}
        setIsOpen={setIsOpenEditImage}
      />
    </React.Fragment>
  );
};

export default ProductEditButton;
