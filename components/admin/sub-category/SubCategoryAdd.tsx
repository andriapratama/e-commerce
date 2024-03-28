"use client";

import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { z } from "zod";

import ButtonLoading from "@/components/ButtonLoading";
import { Button } from "@/components/ui/button";
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
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(3, "Nama sub kategori minimal 3 karakter"),
  slug: z.string().min(3, "Slug sub kategori minimal 3 karakter"),
  category: z.string().min(1, "Kategori tidak boleh kosong"),
});

const SubCategoryAdd = () => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [categorySlug, setCategorySlug] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate } = useSWRConfig();

  const { categories } = useGetCategoriesHook();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      slug: slug,
      category: categorySlug,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      await axios.post("/api/admin/sub-categories/post", {
        name,
        slug,
        categorySlug,
      });

      mutate("/api/admin/sub-categories/get");

      toast.success("Sub kategori berhasil disimpan");

      setName("");
      setSlug("");
      setCategorySlug("");

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-2/3 w-full admin__card h-fit"
      >
        <h2 className="text-xl text-gray-700 font-medium mb-5">
          Tambah Sub Kategori
        </h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Nama</FormLabel>
              <FormControl>
                <Input
                  className="mb-3"
                  placeholder="Masukan nama sub kategori"
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
            <FormItem>
              <FormLabel className="text-gray-700">Slug</FormLabel>
              <FormControl>
                <Input
                  className="mb-3"
                  placeholder="Masukan slug sub kategori"
                  {...field}
                  value={slug}
                  onChange={(e) => handleSetSlug(e.target.value, setSlug)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="mb-3 w-full">
              <FormLabel className="text-gray-700">Kategori</FormLabel>
              <Select onValueChange={setCategorySlug} value={field.value}>
                <FormControl className="capitalize">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      value={category.slug}
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
        <Button disabled={isLoading} type="submit">
          {isLoading ? <ButtonLoading /> : "Simpan"}
        </Button>
      </form>
    </Form>
  );
};

export default SubCategoryAdd;
