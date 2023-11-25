"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CategoryType } from "@/types/CategoryType";
import { toast } from "react-toastify";
import axios from "axios";
import ButtonLoading from "@/components/ButtonLoading";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nama kategori minimal 3 karakter",
  }),
  slug: z.string().min(3, {
    message: "Slug kategori minimal 3 karakter",
  }),
});

interface CategoryEditProps {
  username?: string;
  editCategory: CategoryType;
  setEditCategory: Dispatch<SetStateAction<CategoryType>>;
}

const CategoryEdit: React.FC<CategoryEditProps> = ({
  username,
  editCategory,
  setEditCategory,
}) => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

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

      await axios.patch(
        `/api/${username}/categories/${editCategory.slug}/patch`,
        {
          name: values.name.toLowerCase(),
          slug: values.slug.toLowerCase(),
        }
      );

      toast.success("Kategori berhasil diubah!");

      setName("");
      setSlug("");

      setEditCategory({
        name: "",
        slug: "",
      });

      router.refresh();
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
