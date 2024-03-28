"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingType } from "@/types/admin/SettingType";
import AutosizeTextArea from "@/utils/AutosizeTextArea";
import { zodResolver } from "@hookform/resolvers/zod";

import WarningAlert from "../WarningAlert";
import SettingItem from "./SettingItem";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email tidak boleh kosong")
    .email("Email tidak valid"),
  address: z
    .string()
    .min(1, "Alamat tidak boleh kosong")
    .min(5, "Alamat harus minimal 5 karakter"),
});

interface Props {
  data: SettingType | undefined;
}

const SettingContact: React.FC<Props> = ({ data }) => {
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  if (!data) {
    return null;
  }

  useEffect(() => {
    setEmail(data.email ? data.email : "");
    setAddress(data.address ? data.address : "");
  }, [data]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  AutosizeTextArea(textAreaRef.current, address);

  const { mutate } = useSWRConfig();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      email: email,
      address: address,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.email !== data.email || values.address !== data.address) {
      setIsOpenWarning(true);
    } else {
      setIsOpenEdit(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/setting/contact/patch?id=${data.id}`, {
        email,
        address,
      });

      toast.success("Data kontak berhasil diubah");

      mutate("/api/admin/setting/get");

      setIsOpenEdit(false);
      setIsOpenWarning(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="w-full h-fit bg-white rounded-md shadow-md">
        <div className="w-full border-b px-5 py-2 font-semibold text-xl">
          Kontak
        </div>
        <div className="w-full px-5 py-2">
          <SettingItem title="Email" value={data.email ? data.email : "-"} />
          <SettingItem
            title="Alamat"
            value={data.address ? data.address : "-"}
            border="none"
          />
        </div>
        <div className="w-full border-t px-5 py-2 flex justify-end">
          <Button size="sm" type="button" onClick={() => setIsOpenEdit(true)}>
            Ubah
          </Button>
        </div>
      </div>

      <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <DialogContent className="sm:max-w-[500px] max-w-full max-h-[80vh] overflow-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Ubah Data Kontak</DialogTitle>
              </DialogHeader>

              <div className="w-full gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="mb-3"
                          placeholder="Isi email"
                          {...field}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full mt-5">
                      <FormLabel className="text-gray-700">
                        Deskripsi Produk
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="mb-3 resize-none"
                          placeholder="Isi alamat"
                          {...field}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
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
                      onClick={() => setIsOpenEdit(false)}
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

export default SettingContact;
