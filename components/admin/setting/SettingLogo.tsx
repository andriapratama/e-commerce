"use client";

import axios from "axios";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ACCEPTED_IMAGE_TYPES,
  ImageInputType,
  MAX_FILE_SIZE,
} from "@/types/admin/Image";
import { SettingType } from "@/types/admin/SettingType";
import { zodResolver } from "@hookform/resolvers/zod";

import WarningAlert from "../WarningAlert";

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

interface Props {
  data: SettingType | undefined;
}

const SettingLogo: React.FC<Props> = ({ data }) => {
  if (!data) {
    return null;
  }

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);

  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [image, setImage] = useState<ImageInputType>({
    image: undefined,
    preview: "",
    pathName: "",
  });

  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      image: image.image,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpenWarning(true);
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      const formData: any = new FormData();
      formData.append("image", image.image);

      await axios.patch(
        `/api/admin/setting/logo/patch?id=${data && data.id}&imagePathname=${
          data && data.imagePathname
        }`,
        formData
      );

      toast.success("Logo berhasil diubah");

      mutate("/api/admin/setting/get");

      setIsOpenWarning(false);
      setIsOpenEdit(false);

      setImage({
        image: undefined,
        preview: "",
        pathName: "",
      });

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpenEdit(false);
    setImage({
      image: undefined,
      preview: "",
      pathName: "",
    });
  };

  return (
    <React.Fragment>
      <div className="w-full h-fit bg-white rounded-md shadow-md">
        <div className="w-full border-b px-5 py-2 font-semibold text-xl">
          Logo
        </div>
        <div className="w-full flex justify-center px-5 py-2">
          {data.image && data.imagePathname ? (
            <Image
              src={data.image}
              alt={data.imagePathname}
              width={200}
              height={200}
              className=" object-contain w-[100px] h-[100px]"
              priority
            />
          ) : (
            <ImageIcon width={100} height={100} />
          )}
        </div>
        <div className="w-full border-t px-5 py-2 flex justify-end">
          <Button size="sm" type="button" onClick={() => setIsOpenEdit(true)}>
            Ubah
          </Button>
        </div>
      </div>

      <Dialog open={isOpenEdit} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-[200px] lg:max-w-[300px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Ubah Logo</DialogTitle>
              </DialogHeader>
              {!image.preview ? null : (
                <div className="flex w-full justify-center">
                  <Image
                    src={image.preview}
                    alt={image.pathName}
                    width={550}
                    height={500}
                    className="object-contain mb-3 rounded-md w-full h-auto"
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
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCancel()}
                  >
                    Batal
                  </Button>
                  <Button type="submit">Simpan</Button>
                </div>
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

export default SettingLogo;
