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
import { AdminProductType } from "@/types/ProductType";
import { CategoryType } from "@/types/CategoryType";
import ProductEditFinance from "./ProductEditFinance";
import ProductEditStock from "./ProductEditStock";
import ProductEditStatus from "./ProductEditStatus";
import ProductEditImage from "./ProductEditImage";

interface ProductEditButtonProps {
  product: AdminProductType;
  categories: CategoryType[];
  paramsSlug: string;
  username: string | undefined;
}

const ProductEditButton: React.FC<ProductEditButtonProps> = ({
  product,
  categories,
  paramsSlug,
  username,
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
        paramsSlug={paramsSlug}
        username={username}
      />

      <ProductEditFinance
        isOpen={isOpenEditFinance}
        setIsOpen={setIsOpenEditFinance}
        paramsSlug={paramsSlug}
        product={product}
        username={username}
      />

      <ProductEditStock
        isOpen={isOpenEditStock}
        setIsOpen={setIsOpenEditStock}
        paramsSlug={paramsSlug}
        username={username}
      />

      <ProductEditStatus
        isOpen={isOpenEditStatus}
        setIsOpen={setIsOpenEditStatus}
        product={product}
        paramsSlug={paramsSlug}
        username={username}
      />

      <ProductEditImage
        isOpen={isOpenEditImage}
        setIsOpen={setIsOpenEditImage}
        paramsSlug={paramsSlug}
        username={username}
      />
    </React.Fragment>
  );
};

export default ProductEditButton;
