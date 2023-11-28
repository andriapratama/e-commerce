"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import { Textarea } from "@/components/ui/textarea";
import WarningAlert from "../WarningAlert";
import { AdminProductType } from "@/types/ProductType";
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

interface ProductEditFinanceProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: AdminProductType;
  paramsSlug: string;
  getProduct: () => void;
  getFinanceLog: () => void;
}

const formSchema = z.object({
  price: z
    .string()
    .min(1, "Harga jual harus diisi.")
    .min(3, { message: "Harga jual minimal 100." }),
  cost: z
    .string()
    .min(1, "Harga pokok harus diisi.")
    .min(3, { message: "Harga pokok minimal 100." }),
  note: z.string().optional(),
});

const ProductEditFinance: React.FC<ProductEditFinanceProps> = ({
  isOpen,
  setIsOpen,
  paramsSlug,
  product,
  getProduct,
  getFinanceLog,
}) => {
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setPrice(product.price.toString());
    setCost(product.cost.toString());
    setNote("");
  }, [product, isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      price: price,
      cost: cost,
      note: note,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      parseInt(values.price) !== product.price ||
      parseInt(values.cost) !== product.cost ||
      values.note
    ) {
      setIsOpenWarning(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/products/${paramsSlug}/finance/patch`, {
        price: parseInt(price),
        cost: parseInt(cost),
        note: note,
      });

      getProduct();
      getFinanceLog();

      setIsOpenWarning(false);
      setIsOpen(false);

      toast.success("Harga berhasil diubah");
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Ganti Harga Jual & Harga Pokok</DialogTitle>
              </DialogHeader>
              <div className="lg:flex block gap-3 w-full">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Harga Jual
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3"
                          placeholder="Harga jual"
                          {...field}
                          value={price}
                          onChange={(e) =>
                            handleSetNumber(e.target.value, setPrice)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Harga Pokok
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3 w-full"
                          placeholder="Harga pokok"
                          {...field}
                          value={cost}
                          onChange={(e) =>
                            handleSetNumber(e.target.value, setCost)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">Catatan</FormLabel>
                    <FormControl>
                      <Textarea
                        className="mb-3 resize-none"
                        placeholder="Catatan perubahan harga (optional)"
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

export default ProductEditFinance;
