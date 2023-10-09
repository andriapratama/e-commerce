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

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nama kategori minimal 3 karakter",
  }),
});

interface CategoryEditProps {
  editValue: string;
  setEditValue: (editValue: string) => void;
}

const CategoryEdit: React.FC<CategoryEditProps> = ({
  editValue,
  setEditValue,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editValue,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-2/3 w-full admin__card h-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 text-xl font-semibold">
                Ubah Kategori
              </FormLabel>
              <FormControl>
                <Input
                  className="mb-3"
                  placeholder="Masukkan nama kategori"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 ">
          <Button size="sm" variant="outline" onClick={() => setEditValue("")}>
            Batal
          </Button>
          <Button size="sm" type="submit">
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryEdit;
