"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as IconImage } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ButtonLoading from "@/components/ButtonLoading";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import { ToastContainer, toast } from "react-toastify";
import { CategoriesDataType } from "@/types/admin/Categories";
import BackButton from "./BackButton";
import { useRouter } from "next/navigation";
import { handleSetNumber } from "@/utils/HandleSetNumber";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk harus diisi.")
    .min(3, { message: "Nama minimal 3 karakter" }),
  slug: z
    .string()
    .min(1, "Slug produk harus diisi.")
    .min(3, { message: "Slug minimal 3 karakter." }),
  totalStock: z.string().min(1, "Stok total harus diisi."),
  minimumStock: z.string().min(1, "Stok minimal harus diisi."),
  price: z
    .string()
    .min(1, "Harga jual harus diisi.")
    .min(3, { message: "Harga jual minimal 100." }),
  cost: z
    .string()
    .min(1, "Harga pokok harus diisi.")
    .min(3, { message: "Harga pokok minimal 100." }),
  category: z.string().min(1, "Category harus diisi."),
  status: z.string().min(1, "Status harus diisi."),
  linkGojek: z.string(),
  netFill: z.string().min(1, "Isi bersih harus diisi"),
  description: z.string(),
  image: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `Maksimal ukuran gambar 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Format gambar harus .jpg, .jpeg, .png dan .webp"
    ),
});

interface ImageType {
  image: File | undefined;
  preview: string;
  pathName: string;
}

interface ProductAddFormProps {
  categories: CategoriesDataType[];
}

const ProductAddForm: React.FC<ProductAddFormProps> = ({ categories }) => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [totalStock, setTotalStock] = useState<string>("");
  const [minimumStock, setMinimumStock] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [netFill, setNetFill] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [linkGojek, setLinkGojek] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<ImageType>({
    image: undefined,
    preview: "",
    pathName: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      slug: slug,
      totalStock: totalStock,
      minimumStock: minimumStock,
      price: price,
      cost: cost,
      category: category,
      status: status,
      linkGojek: linkGojek,
      netFill: netFill,
      description: description,
      image: image.image,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("totalStock", values.totalStock);
      formData.append("minimumStock", values.minimumStock);
      formData.append("price", values.price);
      formData.append("cost", values.cost);
      formData.append("category", values.category);
      formData.append("status", values.status);
      formData.append("linkGojek", values.linkGojek);
      formData.append("netFill", values.netFill);
      formData.append("description", values.description);

      const res = await axios.post("/api/admin/products", formData);

      toast.success("Data produk berhasil disimpan");

      const slug = res.data.data.slug;

      setTimeout(() => {
        router.push(`/admin/products/${slug}`);
      }, 1000);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <ToastContainer />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:flex gap-3 block"
      >
        <div className="w-auto">
          <div className="block">
            {!image.preview ? (
              <div className="w-full md:w-[350px] lg:w-[440px] h-[500px] flex justify-center items-center bg-white mb-3 border shadow-sm rounded-md">
                <IconImage width={80} height={80} />
              </div>
            ) : (
              <div className="flex w-full justify-center">
                <Image
                  src={image.preview}
                  alt={image.pathName}
                  width={350}
                  height={500}
                  className="object-containt mb-3 rounded-md"
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="mb-3 w-full"
                      type="file"
                      {...field}
                      value={image.pathName}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          setImage({
                            image: files[0],
                            preview: URL.createObjectURL(files[0]),
                            pathName: e.target.value,
                          });
                        }
                      }}
                      accept="image/png, image/jpg, image/jpeg, image/webp"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex-1">
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
                      onChange={(e) => handleSetSlug(e.target.value, setSlug)}
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
              name="totalStock"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700">Stok Total</FormLabel>
                  <FormControl>
                    <Input
                      className="mb-3"
                      placeholder="Stok total"
                      {...field}
                      value={totalStock}
                      onChange={(e) =>
                        handleSetNumber(e.target.value, setTotalStock)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimumStock"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700">Stok Minimal</FormLabel>
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
          </div>

          <div className="lg:flex block gap-3 w-full">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700">Harga Jual</FormLabel>
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
                  <FormLabel className="text-gray-700">Harga Pokok</FormLabel>
                  <FormControl>
                    <Input
                      className="mb-3 w-full"
                      placeholder="Harga pokok"
                      {...field}
                      value={cost}
                      onChange={(e) => handleSetNumber(e.target.value, setCost)}
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
                      <SelectItem value="active">aktif</SelectItem>
                      <SelectItem value="archive">arsip</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="!mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="lg:flex block gap-3 w-full">
            <FormField
              control={form.control}
              name="linkGojek"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700">Link Gojek</FormLabel>
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
            <FormField
              control={form.control}
              name="netFill"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700">Isi Bersih</FormLabel>
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
          </div>

          <div className="flex justify-end gap-4">
            <BackButton
              name={name}
              slug={slug}
              price={price}
              cost={cost}
              linkGojek={linkGojek}
              description={description}
              image={image.pathName}
              isLoading={isLoading}
            />
            <Button disabled={isLoading} type="submit">
              {isLoading ? <ButtonLoading /> : "Simpan"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProductAddForm;
