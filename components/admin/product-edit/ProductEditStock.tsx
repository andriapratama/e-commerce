"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import { zodResolver } from "@hookform/resolvers/zod";

import WarningAlert from "../WarningAlert";

interface ProductEditStockProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
  stock: z.string().min(1, "Stok produk harus diisi."),
  status: z.string().min(1, "Status harus diisi."),
  note: z.string().optional(),
});

const ProductEditStock: React.FC<ProductEditStockProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [stock, setStock] = useState<string>("");
  const [status, setStatus] = useState<string>("increase");
  const [note, setNote] = useState<string>("");

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams();

  const slugParams = params.id;

  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      stock: stock,
      status: status,
      note: note,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpenWarning(true);
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/products/${slugParams}/stock/patch`, {
        stock: parseInt(stock),
        status: status,
        note: note,
      });

      toast.success("Stok produk berhasil diubah");

      mutate(`/api/admin/products/${slugParams}/data/get`);
      mutate(`/api/admin/products/${slugParams}/stock/get`);

      setIsOpenWarning(false);
      setIsOpen(false);

      setStock("");
      setStatus("increase");
      setNote("");

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Perbarui Stok Produk</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mb-3 w-full">
                    <FormLabel className="text-gray-700">Status</FormLabel>
                    <Select onValueChange={setStatus} value={field.value}>
                      <FormControl className="capitalize">
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="capitalize">
                        <SelectItem value="increase">Tambah</SelectItem>
                        <SelectItem value="update">Ganti</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="!mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">Stok Produk</FormLabel>
                    <FormControl>
                      <Input
                        className="mb-3"
                        placeholder="Masukkan jumlah stok produk"
                        {...field}
                        value={stock}
                        onChange={(e) =>
                          handleSetNumber(e.target.value, setStock)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">Catatan</FormLabel>
                    <FormControl>
                      <Textarea
                        className="mb-3 resize-none"
                        placeholder="Catatan perubahan stok produk (optional)"
                        {...field}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <WarningAlert
        isOpen={isOpenWarning}
        setIsOpen={setIsOpenWarning}
        isLoading={isLoading}
        handleStoreData={handleStoreData}
      />
    </React.Fragment>
  );
};

export default ProductEditStock;
