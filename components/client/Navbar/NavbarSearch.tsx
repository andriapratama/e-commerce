"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { ConvertIDR } from "@/utils/ConvertIDR";
import LoadingGif from "@/components/LoadingGif";
import { useDebouncedCallback } from "use-debounce";
import { ClientProductType } from "@/types/ProductType";

interface Props {
  className: string;
}

const NavbarSearch: React.FC<Props> = ({ className }) => {
  const [search, setSearch] = useState<string>("");

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);

  const [isShowSearchProduct, setIsShowSearchProduct] =
    useState<boolean>(false);

  const [products, setProducts] = useState<ClientProductType[]>([]);

  const handleSearch = useDebouncedCallback(async (value: string) => {
    try {
      if (value) {
        const res = await axios.get(`/api/products/get?search=${value}`);

        setProducts(res.data.data.products);
      }

      setIsLoadingContent(false);
    } catch (error: any) {
      setIsLoadingContent(false);
      toast.error(error.response.data.message);
    }
  }, 800);

  return (
    <div className={`relative ${className && className}`}>
      <Input
        type="text"
        className="w-full lg:w-[400px] h-[50px] bg-white font-normal text-black"
        placeholder="Search product name"
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch(e.target.value);
          setIsLoadingContent(true);
          setIsShowSearchProduct(true);
        }}
        value={search}
      />

      {isShowSearchProduct && (
        <>
          <div
            className="fixed top-0 left-0 bottom-0 right-0 z-50"
            onClick={() => setIsShowSearchProduct(false)}
          />
          <div className="absolute z-50 left-0 right-0 lg:w-[400px] h-fit bg-white overflow-auto text-black font-normal lg:rounded-md">
            {isLoadingContent ? (
              <div className="p-5 w-full flex justify-center">
                <LoadingGif className="!w-6 !h-6" />
              </div>
            ) : products.length > 0 ? (
              products.map((product: ClientProductType, index) => (
                <Link
                  href={`/collections/${product.slug}`}
                  className="w-full flex gap-3 items-center px-5 py-3 cursor-pointer hover:bg-gray-100"
                  key={index}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    height={50}
                    width={50}
                    className="object-contain"
                  />

                  <div className="w-full">
                    <div>{product.name}</div>
                    <div>{ConvertIDR(product.price)}</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full text-center p-5">
                Opss, product not found!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NavbarSearch;
