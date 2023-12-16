"use client";

import { z } from "zod";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonLoading from "@/components/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ACCEPTED_IMAGE_TYPES,
  ImageInputType,
  MAX_FILE_SIZE,
} from "@/types/admin/Image";

const formSchema = z.object({
  image: z
    .any()
    .superRefine((val, ctx) => {
      if (val === null || val === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Gambar harus diisi",
        });
      }
    })
    .refine(
      (files) => files?.size <= MAX_FILE_SIZE,
      `Maksimal ukuran gambar 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
      "Format gambar harus .jpg, .jpeg, .png dan .webp"
    ),
});

interface HeroAddProps {
  getHeros: () => void;
}

const HeroAdd: React.FC<HeroAddProps> = ({ getHeros }) => {
  const [image, setImage] = useState<ImageInputType>({
    image: undefined,
    preview: "",
    pathName: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      image: image.image,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", values.image);

      await axios.post("/api/admin/hero/post", formData);

      getHeros();

      setImage({ image: undefined, preview: "", pathName: "" });

      toast.success("Gambar hero berhasil disimpan");

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[50%]">
        {image.preview ? (
          <div className="w-full flex justify-center mb-3">
            <Image
              src={image.preview}
              alt={image.pathName}
              width={350}
              height={500}
              className="object-contain rounded-md h-[500px] w-auto"
            />
          </div>
        ) : null}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full admin__card"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-700 text-xl">
                    Tambah Gambar
                  </FormLabel>
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

            <div className="flex gap-3">
              {image.preview && (
                <Button
                  disabled={isLoading}
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setImage({ image: undefined, preview: "", pathName: "" })
                  }
                >
                  Batal
                </Button>
              )}

              <Button disabled={isLoading} type="submit">
                {isLoading ? <ButtonLoading /> : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HeroAdd;
