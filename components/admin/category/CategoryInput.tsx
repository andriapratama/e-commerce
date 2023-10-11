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
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ButtonLoading from "@/components/ButtonLoading";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nama kategori minimal 3 karakter",
  }),
  slug: z.string().min(3, {
    message: "Slug kategori minimal 3 karakter",
  }),
});

interface CategoryInputProps {
  showCategories: () => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ showCategories }) => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetSlug = (value: string) => {
    if (value.match(" ")) {
      const replaceValue = value.replace(" ", "-");
      setSlug(replaceValue);
    } else {
      setSlug(value);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      slug: slug,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      await axios.post("/api/admin/categories", {
        name: values.name,
        slug: values.slug,
      });

      setName("");
      setSlug("");

      toast.success("Kategori berhasil dibuat!");

      showCategories();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-2/3 w-full admin__card h-full"
      >
        <h2 className="text-xl text-gray-700 font-medium mb-5">
          Tambah Kategori
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
                    handleSetSlug(e.target.value);
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
                  onChange={(e) => handleSetSlug(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? <ButtonLoading /> : "Simpan"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryInput;
