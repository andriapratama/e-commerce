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
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

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
    <>
      <ToastContainer />
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
            {loading ? (
              <>
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-4 h-4 mr-3 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
                Loading...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryInput;
