"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import { Textarea } from "@/components/ui/textarea";
import WarningAlert from "../WarningAlert";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminProductType } from "@/types/ProductType";

interface ProductEditStatusProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: AdminProductType;
  paramsSlug: string;
  username: string | undefined;
}

const ProductEditStatus: React.FC<ProductEditStatusProps> = ({
  isOpen,
  setIsOpen,
  product,
  paramsSlug,
  username,
}) => {
  const [salePrice, setSalePrice] = useState<string>(
    product.salePrice.toString()
  );
  const [status, setStatus] = useState<string>(product.status);
  const [note, setNote] = useState<string>("");

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const formSchema =
    status === "sale"
      ? z.object({
          salePrice: z
            .string()
            .min(1, "Harga sale harus diisi.")
            .min(3, "Harga sale minimal Rp. 100,00"),
          status: z.string().min(1, "Status harus diisi."),
          note: z.string().optional(),
        })
      : z.object({
          salePrice: z.string().optional(),
          status: z.string().min(1, "Status harus diisi."),
          note: z.string().optional(),
        });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      salePrice: salePrice,
      status: status,
      note: note,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      status !== product.status ||
      parseInt(salePrice) !== product.salePrice
    ) {
      setIsOpenWarning(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      const res = await axios.patch(
        `/api/${username}/products/${paramsSlug}/status/patch`,
        {
          salePrice: parseInt(salePrice),
          status: status,
          note: note,
        }
      );

      setIsOpenWarning(false);
      setIsOpen(false);

      const saleRes = res.data.data;

      setSalePrice(saleRes.salePrice.toString());
      setStatus(saleRes.sale);
      setNote("");

      router.refresh();

      toast.success("Status produk berhasil diubah");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
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
                        <SelectItem value="new">Baru</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="best">Best Seller</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="archive">Arsip</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="!mt-1" />
                  </FormItem>
                )}
              />

              {status === "sale" ? (
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Harga Sale
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3"
                          placeholder="Masukkan harga sale"
                          {...field}
                          value={salePrice}
                          onChange={(e) =>
                            handleSetNumber(e.target.value, setSalePrice)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

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

export default ProductEditStatus;
