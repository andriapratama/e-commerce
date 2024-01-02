"use client";

import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProductInputType } from "./PromoAddForm";
import { AdminProductType } from "@/types/ProductType";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingGif from "@/components/LoadingGif";
import { ConvertIDR } from "@/utils/ConvertIDR";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  productProvisions: ProductInputType[];
  setProductProvisions: Dispatch<SetStateAction<ProductInputType[]>>;
  productBonus: ProductInputType[];
  setProductBonus: Dispatch<SetStateAction<ProductInputType[]>>;
  status: "provision" | "bonus";
  handleSumSubTotal: (
    products: ProductInputType[],
    status: "provision" | "bonus"
  ) => void;
}

const PromoAddOpenProduct: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  productProvisions,
  setProductProvisions,
  productBonus,
  setProductBonus,
  status,
  handleSumSubTotal,
}) => {
  const [products, setProducts] = useState<AdminProductType[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [pageNow, setPageNow] = useState<number>(1);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const getProducts = useCallback(async (page: number) => {
    try {
      const res = await axios.get(`/api/admin/products/get?page=${page}`);

      setProducts(res.data.data.products);
      setTotalPage(res.data.data.totalPage);
      setIsLoadingContent(false);
    } catch (error: any) {
      setIsLoadingContent(false);
      toast.error(error.response.data.message);
    }
  }, []);

  const handleAdd = (product: AdminProductType) => {
    if (status === "provision") {
      const index = productProvisions.map((e) => e.name).indexOf(product.name);

      let newProduct = [...productProvisions];

      if (index >= 0) {
        newProduct[index].quantity = newProduct[index].quantity + 1;
        newProduct[index].subTotal = newProduct[index].subTotal + product.price;

        setProductProvisions(newProduct);
        handleSumSubTotal(newProduct, "provision");
      } else {
        const productInput = {
          image: product.image,
          name: product.name,
          price: product.price,
          quantity: 1,
          subTotal: product.price,
        };

        setProductProvisions((prev) => [...prev, productInput]);

        newProduct.push(productInput);

        handleSumSubTotal(newProduct, "provision");
      }
    } else {
      const index = productBonus.map((e) => e.name).indexOf(product.name);

      let newProduct = [...productBonus];

      if (index >= 0) {
        newProduct[index].quantity = newProduct[index].quantity + 1;
        newProduct[index].subTotal = newProduct[index].subTotal + product.price;

        setProductBonus(newProduct);
        handleSumSubTotal(newProduct, "bonus");
      } else {
        const productInput = {
          image: product.image,
          name: product.name,
          price: product.price,
          quantity: 1,
          subTotal: product.price,
        };

        setProductBonus((prev) => [...prev, productInput]);

        newProduct.push(productInput);

        handleSumSubTotal(newProduct, "bonus");
      }
    }

    handleClose();
  };

  const pagination = () => {
    let pagination: number[] = [];

    for (let i = 0; i < totalPage; i++) {
      pagination.push(i + 1);
    }

    return pagination.map((page) => {
      const before = pageNow - 2;
      const after = pageNow + 2;

      if (page < before) {
        return null;
      } else if (page > after) {
        return null;
      } else {
        return (
          <button
            className={`w-7 h-7 flex justify-center items-center border ${
              page === pageNow
                ? "cursor-not-allowed bg-gray-300"
                : "cursor-pointer hover:bg-gray-300 bg-white"
            }`}
            onClick={() => {
              setPageNow(page);
              setIsLoadingContent(true);
            }}
            type="button"
            disabled={page === pageNow ? true : false}
            key={page}
          >
            {page}
          </button>
        );
      }
    });
  };

  const handleSearch = useDebouncedCallback(async () => {
    try {
      setIsLoadingContent(true);

      if (search) {
        const res = await axios.get(`/api/admin/products/get?search=${search}`);

        setProducts(res.data.data.products);
      }

      setIsLoadingContent(false);
    } catch (error: any) {
      setIsLoadingContent(false);
      toast.error(error.response.data.message);
    }
  }, 1000);

  useEffect(() => {
    if (search) {
      handleSearch();
    } else {
      getProducts(pageNow);
    }
  }, [search, handleSearch, getProducts, pageNow]);

  const handleClose = () => {
    setSearch("");
    setPageNow(1);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-fit overflow-hidden">
        <DialogHeader>
          <DialogTitle>Pilih Produk</DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <Label htmlFor="search">Cari</Label>
          <Input
            id="search"
            placeholder="Cari produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoadingContent ? (
          <div className="full flex justify-center">
            <LoadingGif className="!w-8 !h-8" />
          </div>
        ) : (
          <div className="w-full max-h-[70vh] overflow-auto">
            <Table className="bg-white rounded mt-1 mb-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Gambar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="text-center">Kategori</TableHead>
                  <TableHead className="text-center">Sub Kategori</TableHead>
                  <TableHead className="text-center">Harga</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="object-contain h-[50px] w-auto"
                          priority
                        />
                      </TableCell>
                      <TableCell className="capitalize">
                        {product.name}
                      </TableCell>
                      <TableCell className="capitalize text-center">
                        {product.category.name}
                      </TableCell>
                      <TableCell className="capitalize text-center">
                        {product.subCategory ? product.subCategory.name : "-"}
                      </TableCell>
                      <TableCell className="capitalize text-center">
                        {ConvertIDR(product.price)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="default"
                          size="sm"
                          type="button"
                          onClick={() => handleAdd(product)}
                        >
                          Tambah
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {search ? null : (
          <div className="w-full flex justify-center">
            <button
              className={`w-7 h-7 flex justify-center items-center border ${
                pageNow === 1
                  ? "cursor-not-allowed bg-gray-300"
                  : "cursor-pointer hover:bg-gray-300 bg-white"
              }`}
              onClick={() => {
                setPageNow((prev) => (prev === 1 ? 1 : prev - 1));
                setIsLoadingContent(true);
              }}
              type="button"
              disabled={pageNow === 1 ? true : false}
            >
              <ChevronLeft />
            </button>

            {pagination()}

            <button
              className={`w-7 h-7 flex justify-center items-center border ${
                pageNow === totalPage
                  ? "cursor-not-allowed bg-gray-300"
                  : "cursor-pointer hover:bg-gray-300 bg-white"
              }`}
              onClick={() => {
                setIsLoadingContent(true);
                setPageNow((prev) =>
                  prev === totalPage ? totalPage : prev + 1
                );
              }}
              type="button"
              disabled={pageNow === totalPage ? true : false}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PromoAddOpenProduct;
