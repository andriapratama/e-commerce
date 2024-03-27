"use client";

import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import * as z from "zod";

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
import { CategoryType } from "@/types/CategoryType";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nama kategori minimal 3 karakter",
  }),
  slug: z.string().min(3, {
    message: "Slug kategori minimal 3 karakter",
  }),
});

interface CategoryEditProps {
  editCategory: CategoryType;
  setEditCategory: Dispatch<SetStateAction<CategoryType>>;
}

const CategoryEdit: React.FC<CategoryEditProps> = ({
  editCategory,
  setEditCategory,
}) => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    setName(editCategory.name);
    setSlug(editCategory.slug);
  }, [editCategory]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      slug: slug,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/categories/${editCategory.slug}/patch`, {
        name: values.name.toLowerCase(),
        slug: values.slug.toLowerCase(),
      });

      toast.success("Kategori berhasil diubah!");

      setName("");
      setSlug("");

      setEditCategory({
        name: "",
        slug: "",
      });

      mutate("/api/admin/categories/get");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-2/3 w-full admin__card h-full"
      >
        <h2 className="text-xl text-gray-700 font-medium mb-5">
          Edit Kategori
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
                  placeholder="Masukkan nama kategori"
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
                  placeholder="Masukkan slug kategori"
                  {...field}
                  value={slug}
                  onChange={(e) => handleSetSlug(e.target.value, setSlug)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 ">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() =>
              setEditCategory({
                name: "",
                slug: "",
              })
            }
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button disabled={isLoading} size="sm" type="submit">
            {isLoading ? <ButtonLoading /> : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryEdit;
