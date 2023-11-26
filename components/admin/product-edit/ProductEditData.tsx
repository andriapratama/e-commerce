"use client";

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
import { AdminProductType } from "@/types/ProductType";
import { CategoryType } from "@/types/CategoryType";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import WarningAlert from "../WarningAlert";

interface ProductEditDataProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: AdminProductType;
  categories: CategoryType[];
  paramsSlug: string;
  username: string | undefined;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk harus diisi.")
    .min(3, "Nama minimal 3 karakter"),
  slug: z
    .string()
    .min(1, "Slug produk harus diisi.")
    .min(3, "Slug minimal 3 karakter."),
  minimumStock: z.string().min(1, "Stok minimal harus diisi."),
  category: z.string().min(1, "Category harus diisi."),
  linkGojek: z.string().optional(),
  netFill: z.string().min(1, "Isi bersih harus diisi"),
  description: z.string().optional(),
});

const ProductEditData: React.FC<ProductEditDataProps> = ({
  isOpen,
  setIsOpen,
  product,
  categories,
  paramsSlug,
  username,
}) => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [minimumStock, setMinimumStock] = useState<string>("");
  const [netFill, setNetFill] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [linkGojek, setLinkGojek] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setName(product.name);
    setSlug(product.slug);
    setMinimumStock(product.minimumStock.toString());
    setNetFill(product.netFill.toString());
    setCategory(product.category.name);
    setLinkGojek(product.linkGojek);
    setDescription(product.description);
  }, [product, isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      slug: slug,
      minimumStock: minimumStock,
      category: category,
      linkGojek: linkGojek,
      netFill: netFill,
      description: description,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (
      values.name !== product.name ||
      values.slug !== product.slug ||
      parseInt(values.minimumStock) !== product.minimumStock ||
      values.category !== product.category.name ||
      values.linkGojek !== product.linkGojek ||
      parseInt(values.netFill) !== product.netFill ||
      values.description !== product.description
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
        `/api/${username}/products/${paramsSlug}/data/patch`,
        {
          name: name,
          slug: slug,
          minimumStock: parseInt(minimumStock),
          category: category,
          linkGojek: linkGojek,
          netFill: parseInt(netFill),
          description: description,
        }
      );

      const resSlug = res.data.data;

      if (resSlug !== paramsSlug) {
        router.push(`/admin/products/${resSlug}`);
      } else {
        router.refresh();
      }

      setIsOpenWarning(false);
      setIsOpen(false);

      toast.success("Data produk berhasil diubah");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] lg:max-w-[800px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Edit Data Produk</DialogTitle>
              </DialogHeader>
              <div className="lg:flex block gap-3 w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Nama</FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3"
                          placeholder="Masukkan nama produk"
                          {...field}
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            handleSetSlug(e.target.value, setSlug);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Slug</FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3 w-full"
                          placeholder="Masukkan slug produk"
                          {...field}
                          value={slug}
                          onChange={(e) =>
                            handleSetSlug(e.target.value, setSlug)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="lg:flex block gap-3 w-full">
                <FormField
                  control={form.control}
                  name="minimumStock"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Stok Minimal
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3 w-full"
                          placeholder="Stok minimal"
                          {...field}
                          value={minimumStock}
                          onChange={(e) =>
                            handleSetNumber(e.target.value, setMinimumStock)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="netFill"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Isi Bersih
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3 w-full"
                          placeholder="Isi bersih produk"
                          {...field}
                          value={netFill}
                          onChange={(e) =>
                            handleSetNumber(e.target.value, setNetFill)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="lg:flex block gap-3 w-full">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="mb-3 w-full">
                      <FormLabel className="text-gray-700">Kategori</FormLabel>
                      <Select onValueChange={setCategory} value={field.value}>
                        <FormControl className="capitalize">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              value={category.name}
                              key={category.name}
                              className="capitalize"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="!mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkGojek"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Link Gojek
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3"
                          placeholder="Link gojek"
                          {...field}
                          value={linkGojek}
                          onChange={(e) => setLinkGojek(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">
                      Deskripsi Produk
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="mb-3 resize-none"
                        placeholder="Isi deskripsi produk"
                        {...field}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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

export default ProductEditData;
