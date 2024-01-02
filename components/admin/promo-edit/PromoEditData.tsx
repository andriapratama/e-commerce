"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PromoType } from "@/types/PromoType";
import { toast } from "react-toastify";
import { handleSetSlug } from "@/utils/HandleSetSlug";
import { Input } from "@/components/ui/input";
import { handleSetNumber } from "@/utils/HandleSetNumber";
import { Textarea } from "@/components/ui/textarea";
import AutosizeTextArea from "@/utils/AutosizeTextArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ButtonLoading from "@/components/ButtonLoading";
import WarningAlert from "../WarningAlert";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Props {
  getPromo: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  promo: PromoType;
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
});

const PromoEditData: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  promo,
  getPromo,
}) => {
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [firstPrice, setFirstPrice] = useState<string>("0");
  const [promoPrice, setPromoPrice] = useState<string>("0");
  const [promoStatus, setPromoStatus] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  AutosizeTextArea(textAreaRef.current, description);

  const params = useParams();

  const paramsSlug = params.id;

  const router = useRouter();

  useEffect(() => {
    setName(promo.name);
    setSlug(promo.slug);
    setFirstPrice(promo.firstPrice.toString());
    setPromoPrice(promo.promoPrice.toString());
    setPromoStatus(promo.status);
    setDescription(promo.description);
  }, [promo, isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: name,
      slug: slug,
      firstPrice: firstPrice,
      promoPrice: promoPrice,
      promoStatus: promoStatus,
      description: description,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      values.name !== promo.name ||
      values.slug !== promo.slug ||
      values.description !== promo.description ||
      parseInt(values.firstPrice) !== promo.firstPrice ||
      parseInt(values.promoPrice) !== promo.promoPrice ||
      values.promoStatus !== promo.status
    ) {
      setIsOpenWarning(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      console.log("masuk");

      const res = await axios.patch(
        `/api/admin/promos/${paramsSlug}/data/patch`,
        {
          name,
          slug,
          firstPrice,
          promoPrice,
          status: promoStatus,
          description,
        }
      );

      const resSlug: string = res.data.data.slug;

      if (resSlug !== paramsSlug) {
        router.push(`/admin/promos/${resSlug}`);
      } else {
        getPromo();
      }

      toast.success("Data produk berhasil disimpan");

      setIsOpen(false);
      setIsOpenWarning(false);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] max-w-full max-h-[80vh] overflow-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Edit Data Promo</DialogTitle>
              </DialogHeader>

              <div className="w-full gap-3">
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

                <DialogFooter>
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                  </div>
                </DialogFooter>
              </div>
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

export default PromoEditData;
