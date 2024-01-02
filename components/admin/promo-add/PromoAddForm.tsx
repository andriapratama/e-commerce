"use client";

import { z } from "zod";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image as IconImage } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import ButtonLoading from "@/components/ButtonLoading";
import AutosizeTextArea from "@/utils/AutosizeTextArea";
import React, { useEffect, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_TYPES,
  ImageInputType,
  MAX_FILE_SIZE,
} from "@/types/admin/Image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PromoAddOpenProduct from "./PromoAddOpenProduct";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import PromoAddProvisions from "./PromoAddProvisions";
import PromoAddBonus from "./PromoAddBonus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageLoading from "@/components/PageLoading";

export interface ProductInputType {
  image: string;
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
}

const PromoAddForm = () => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [firstPrice, setFirstPrice] = useState<string>("0");
  const [promoPrice, setPromoPrice] = useState<string>("0");
  const [promoStatus, setPromoStatus] = useState<string>("active");
  const [description, setDescription] = useState<string>("");
  const [productProvisions, setProductProvisions] = useState<
    ProductInputType[]
  >([]);
  const [productBonus, setProductBonus] = useState<ProductInputType[]>([]);
  const [image, setImage] = useState<ImageInputType>({
    image: undefined,
    preview: "",
    pathName: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenProduct, setIsOpenProduct] = useState<boolean>(false);
  const [status, setStatus] = useState<"provision" | "bonus">("provision");
  const [subTotalProvision, setSubTotalProvision] = useState<number>(0);
  const [subTotalBonus, setSubTotalBonus] = useState<number>(0);

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  AutosizeTextArea(textAreaRef.current, description);

  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(1, "Nama produk harus diisi.")
      .min(3, "Nama minimal 3 karakter"),
    slug: z
      .string()
      .min(1, "Slug produk harus diisi.")
      .min(3, "Slug minimal 3 karakter."),
    productProvisions: z.any().superRefine((val, ctx) => {
      if (val.length <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Syarat produk harus diisi",
        });
      }
    }),
    productBonus: z.any().superRefine((val, ctx) => {
      if (val.length <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bonus produk harus diisi",
        });
      }
    }),
    firstPrice: z
      .string()
      .min(1, "Harga awal harus diisi")
      .min(4, "Harga awal minimal Rp 1.000"),
    promoPrice: z
      .string()
      .min(1, "Harga promo harus diisi")
      .min(4, "Harga promo minimal Rp 1.000"),
    promoStatus: z.string().min(1, "Status promo harus diisi"),
    description: z.string().optional(),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      slug: slug,
      productProvisions: productProvisions,
      productBonus: productBonus,
      firstPrice: firstPrice,
      promoPrice: promoPrice,
      promoStatus: promoStatus,
      description: description,
      image: image.image,
    },
  });

  const handleIncrease = (status: "provision" | "bonus", index: number) => {
    let newProduct = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const quantity = newProduct[index].quantity;
    const price = newProduct[index].price;
    const subTotal = newProduct[index].subTotal;

    if (quantity >= 1000) {
      newProduct[index].quantity = 1000;
      newProduct[index].subTotal = 1000 * price;
    } else {
      newProduct[index].quantity = quantity + 1;
      newProduct[index].subTotal = subTotal + price;
    }

    if (status === "provision") {
      setProductProvisions(newProduct);
      handleSumSubTotal(newProduct, "provision");
    } else {
      handleSumSubTotal(newProduct, "bonus");
      setProductBonus(newProduct);
    }
  };

  const handleSetQuantity = (
    value: number,
    status: "provision" | "bonus",
    index: number
  ) => {
    let newProduct = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const price = newProduct[index].price;

    if (value >= 1000) {
      newProduct[index].quantity = 1000;
      newProduct[index].subTotal = 1000 * price;
    } else if (value <= 1 || !value) {
      newProduct[index].quantity = 1;
      newProduct[index].subTotal = price;
    } else {
      newProduct[index].quantity = value;
      newProduct[index].subTotal = value * price;
    }

    if (status === "provision") {
      handleSumSubTotal(newProduct, "provision");
      setProductProvisions(newProduct);
    } else {
      handleSumSubTotal(newProduct, "bonus");
      setProductBonus(newProduct);
    }
  };

  const handleDecrease = (status: "provision" | "bonus", index: number) => {
    let newProduct = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const quantity = newProduct[index].quantity;
    const price = newProduct[index].price;
    const subTotal = newProduct[index].subTotal;

    if (quantity <= 1) {
      newProduct[index].quantity = 1;
      newProduct[index].subTotal = price;
    } else {
      newProduct[index].quantity = quantity - 1;
      newProduct[index].subTotal = subTotal - price;
    }

    if (status === "provision") {
      handleSumSubTotal(newProduct, "provision");
      setProductProvisions(newProduct);
    } else {
      handleSumSubTotal(newProduct, "bonus");
      setProductBonus(newProduct);
    }
  };

  const handleDelete = (status: "provision" | "bonus", index: number) => {
    let newProduct: any[] = [];

    if (status === "provision") {
      newProduct = [...productProvisions];
    } else {
      newProduct = [...productBonus];
    }

    const productFilter = newProduct.filter((product, idx) => idx !== index);

    if (status === "provision") {
      handleSumSubTotal(productFilter, "provision");
      setProductProvisions(productFilter);
    } else {
      handleSumSubTotal(productFilter, "bonus");
      setProductBonus(productFilter);
    }
  };

  const handleSumSubTotal = (
    products: ProductInputType[],
    status: "provision" | "bonus"
  ) => {
    const total = Object.values(products).reduce((a, b) => a + b.subTotal, 0);

    if (status === "provision") {
      setSubTotalProvision(total);
      setPromoPrice(total.toString());
    } else {
      setSubTotalBonus(total);
    }
  };

  useEffect(() => {
    const total = subTotalProvision + subTotalBonus;
    setFirstPrice(total.toString());
  }, [subTotalBonus, subTotalProvision]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("firstPrice", values.firstPrice);
      formData.append("promoPrice", values.promoPrice);
      formData.append("status", values.promoStatus);
      formData.append(
        "description",
        values.description ? values.description : ""
      );
      formData.append("status", values.promoStatus);

      formData.append(`provisions`, JSON.stringify(values.productProvisions));
      formData.append(`bonus`, JSON.stringify(values.productBonus));

      const res = await axios.post(`/api/admin/promos/post`, formData);

      setIsLoadingPage(true);

      const slug = res.data.data.slug;

      router.push(`/admin/promos/${slug}`);

      setTimeout(() => {
        toast.success("Data produk berhasil disimpan");
      }, 1000);

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {isLoadingPage ? (
        <PageLoading />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex justify-center gap-3"
          >
            <div className="w-[80%]">
              <div className="block">
                {!image.preview ? (
                  <div className="w-full h-[400px] flex justify-center items-center bg-white mb-3 border shadow-sm rounded-md">
                    <IconImage width={80} height={80} />
                  </div>
                ) : (
                  <div className="flex w-full justify-center">
                    <Image
                      src={image.preview}
                      alt={image.pathName}
                      width={350}
                      height={500}
                      className="object-containt mb-3 rounded-md h-[500px] w-auto"
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
                            if (files && files.length > 0) {
                              setImage({
                                image: files[0],
                                preview: URL.createObjectURL(files[0]),
                                pathName: e.target.value,
                              });
                            } else {
                              setImage((previous) => ({
                                image: previous.image,
                                preview: previous.preview,
                                pathName: "",
                              }));
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
                          placeholder="Masukkan nama promo"
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
                          placeholder="Masukkan slug promo"
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

              <PromoAddProvisions
                form={form}
                productProvisions={productProvisions}
                handleDecrease={handleDecrease}
                handleSetQuantity={handleSetQuantity}
                handleIncrease={handleIncrease}
                handleDelete={handleDelete}
                subTotalProvision={subTotalProvision}
                setIsOpenProduct={setIsOpenProduct}
                setStatus={setStatus}
              />

              <PromoAddBonus
                form={form}
                productBonus={productBonus}
                handleDecrease={handleDecrease}
                handleSetQuantity={handleSetQuantity}
                handleIncrease={handleIncrease}
                handleDelete={handleDelete}
                subTotalBonus={subTotalBonus}
                setIsOpenProduct={setIsOpenProduct}
                setStatus={setStatus}
              />

              <div className="lg:flex block gap-3 w-full mt-5">
                <FormField
                  control={form.control}
                  name="firstPrice"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Harga Awal
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3"
                          placeholder="Harga jual"
                          {...field}
                          value={firstPrice}
                          onChange={(e) =>
                            handleSetNumber(e.target.value, setFirstPrice)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="promoPrice"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Harga Promo
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="mb-3 w-full"
                          placeholder="Harga pokok"
                          {...field}
                          value={promoPrice}
                          onChange={(e) =>
                            handleSetNumber(e.target.value, setPromoPrice)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="promoStatus"
                  render={({ field }) => (
                    <FormItem className="mb-3 w-full">
                      <FormLabel className="text-gray-700">Status</FormLabel>
                      <Select
                        onValueChange={setPromoStatus}
                        value={field.value}
                      >
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full mt-5">
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
                        ref={textAreaRef}
                        rows={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button disabled={isLoading} type="submit">
                  {isLoading ? <ButtonLoading /> : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}

      <PromoAddOpenProduct
        isOpen={isOpenProduct}
        setIsOpen={setIsOpenProduct}
        productProvisions={productProvisions}
        setProductProvisions={setProductProvisions}
        productBonus={productBonus}
        setProductBonus={setProductBonus}
        status={status}
        handleSumSubTotal={handleSumSubTotal}
      />
    </React.Fragment>
  );
};

export default PromoAddForm;
