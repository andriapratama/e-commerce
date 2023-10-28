"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductEditData from "./ProductEditData";
import { ProductType } from "@/types/ProductType";
import { CategoriesDataType } from "@/types/admin/Categories";
import ProductEditFinance from "./ProductEditFinance";
import ProductEditStock from "./ProductEditStock";
import ProductEditSale from "./ProductEditSale";

interface ProductEditButtonProps {
  product: ProductType;
  categories: CategoriesDataType[];
  paramsSlug: string;
}

const ProductEditButton: React.FC<ProductEditButtonProps> = ({
  product,
  categories,
  paramsSlug,
}) => {
  const [isOpenEditData, setIsOpenEditData] = useState<boolean>(false);
  const [isOpenEditFinance, setIsOpenEditFinance] = useState<boolean>(false);
  const [isOpenEditStock, setIsOpenEditStock] = useState<boolean>(false);
  const [isOpenEditSale, setIsOpenEditSale] = useState<boolean>(false);
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
            onClick={() => setIsOpenEditSale(true)}
          >
            Status Sale
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            Ganti Gambar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductEditData
        isOpen={isOpenEditData}
        setIsOpen={setIsOpenEditData}
        product={product}
        categories={categories}
        paramsSlug={paramsSlug}
      />

      <ProductEditFinance
        isOpen={isOpenEditFinance}
        setIsOpen={setIsOpenEditFinance}
        paramsSlug={paramsSlug}
        product={product}
      />

      <ProductEditStock
        isOpen={isOpenEditStock}
        setIsOpen={setIsOpenEditStock}
        paramsSlug={paramsSlug}
      />

      <ProductEditSale
        isOpen={isOpenEditSale}
        setIsOpen={setIsOpenEditSale}
        product={product}
        paramsSlug={paramsSlug}
      />
    </React.Fragment>
  );
};

export default ProductEditButton;
