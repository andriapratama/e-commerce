"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import WarningAlert from "../WarningAlert";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  ImageInputType,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
} from "@/types/admin/Image";
import Image from "next/image";

const formSchema = z.object({
  image: z
    .any()
    .refine(
      (files) => files?.size <= MAX_FILE_SIZE,
      `Maksimal ukuran gambar 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
      "Format gambar harus .jpg, .jpeg, .png dan .webp"
    ),
});

interface ProductEditImageProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  paramsSlug: string;
  username: string | undefined;
}

const ProductEditImage: React.FC<ProductEditImageProps> = ({
  isOpen,
  setIsOpen,
  paramsSlug,
  username,
}) => {
  const [image, setImage] = useState<ImageInputType>({
    image: undefined,
    preview: "",
    pathName: "",
  });

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      image: image.image,
    },
  });

  useEffect(() => {
    setImage({
      image: undefined,
      preview: "",
      pathName: "",
    });
  }, [isOpen === false]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpenWarning(true);
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      const formData: any = new FormData();
      formData.append("image", image.image);

      await axios.patch(
        `/api/${username}/products/${paramsSlug}/image/patch`,
        formData
      );

      router.refresh();

      setIsOpenWarning(false);
      setIsOpen(false);

      setImage({
        image: undefined,
        preview: "",
        pathName: "",
      });

      toast.success("Gambar produk berhasil diubah");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Ubah Gambar</DialogTitle>
              </DialogHeader>
              {!image.preview ? null : (
                <div className="flex w-full justify-center">
                  <Image
                    src={image.preview}
                    alt={image.pathName}
                    width={550}
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
              <DialogFooter>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
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

export default ProductEditImage;
