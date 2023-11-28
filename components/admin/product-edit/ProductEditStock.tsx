"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import { Textarea } from "@/components/ui/textarea";
import WarningAlert from "../WarningAlert";
import { toast } from "react-toastify";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductEditStockProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  paramsSlug: string;
  getProduct: () => void;
  getStockLog: () => void;
}

const formSchema = z.object({
  stock: z.string().min(1, "Stok produk harus diisi."),
  status: z.string().min(1, "Status harus diisi."),
  note: z.string().optional(),
});

const ProductEditStock: React.FC<ProductEditStockProps> = ({
  isOpen,
  setIsOpen,
  paramsSlug,
  getProduct,
  getStockLog,
}) => {
  const [stock, setStock] = useState<string>("");
  const [status, setStatus] = useState<string>("increase");
  const [note, setNote] = useState<string>("");

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      await axios.patch(`/api/admin/products/${paramsSlug}/stock/patch`, {
        stock: parseInt(stock),
        status: status,
        note: note,
      });

      toast.success("Stok produk berhasil diubah");

      getProduct();
      getStockLog();

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
