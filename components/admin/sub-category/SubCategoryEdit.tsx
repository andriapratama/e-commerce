"use client";

import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { CategoryType, SubCategoryType } from "@/types/CategoryType";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(3, "Nama sub kategori minimal 3 karakter"),
  slug: z.string().min(3, "Slug sub kategori minimal 3 karakter"),
  category: z.string().min(1, "Kategori tidak boleh kosong"),
});

interface Props {
  editData: SubCategoryType;
  setEditData: Dispatch<SetStateAction<SubCategoryType>>;
  categories: CategoryType[] | undefined;
}

const SubCategoryEdit: React.FC<Props> = ({
  editData,
  setEditData,
  categories,
}) => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [categorySlug, setCategorySlug] = useState<string>("");

  const { mutate } = useSWRConfig();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setName(editData.name);
    setSlug(editData.slug);
    setCategorySlug(editData.category.slug);
  }, [editData]);

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

      await axios.patch(`/api/admin/sub-categories/${editData.slug}/patch`, {
        name,
        slug,
        categorySlug,
      });

      mutate("/api/admin/sub-categories/get");

      toast.success("Sub kategori berhasil diubah");

      setName("");
      setSlug("");
      setCategorySlug("");

      setEditData({
        name: "",
        slug: "",
        category: {
          name: "",
          slug: "",
        },
      });

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
          Edit Sub Kategori
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
              <Select onValueChange={setCategorySlug} value={categorySlug}>
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

        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() =>
              setEditData({
                name: "",
                slug: "",
                category: {
                  name: "",
                  slug: "",
                },
              })
            }
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button disabled={isLoading} type="submit" size="sm">
            {isLoading ? <ButtonLoading /> : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubCategoryEdit;
