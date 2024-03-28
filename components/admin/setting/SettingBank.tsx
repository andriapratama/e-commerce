"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { SettingType } from "@/types/admin/SettingType";
import { zodResolver } from "@hookform/resolvers/zod";

import WarningAlert from "../WarningAlert";
import SettingItem from "./SettingItem";

const formSchema = z.object({
  bank: z
    .string()
    .min(1, "Nama Bank tidak boleh kosong")
    .min(5, "Nama Bank minimal 5 karakter")
    .max(40, "Nama Bank maksimal 40 karakter"),
  bankName: z
    .string()
    .min(1, "Nama pemilik rekening tidak boleh kosong")
    .min(5, "Nama pemilik rekening minimal 5 karakter")
    .max(30, "Nama pemilik rekening maksimal 30 karakter"),
  bankNumber: z
    .string()
    .min(1, "Nomor rekening tidak boleh kosong")
    .min(10, "Nomor rekening minimal 10 digit")
    .max(16, "Nomor rekening maksimal 16 digit"),
});

interface Props {
  data: SettingType | undefined;
}

const SettingBank: React.FC<Props> = ({ data }) => {
  if (!data) {
    return null;
  }

  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bank, setBank] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankNumber, setBankNumber] = useState<string>("");

  const { mutate } = useSWRConfig();

  useEffect(() => {
    setBank(data.bank ? data.bank : "");
    setBankName(data.bankName ? data.bankName : "");
    setBankNumber(data.bankNumber ? data.bankNumber : "");
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      bank: bank,
      bankName: bankName,
      bankNumber: bankNumber,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      values.bank !== data.bank ||
      values.bankName !== data.bankName ||
      values.bankNumber !== data.bankNumber
    ) {
      setIsOpenWarning(true);
    } else {
      setIsOpenEdit(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/setting/bank/patch?id=${data.id}`, {
        bank,
        bankName,
        bankNumber,
      });

      toast.success("Data bank berhasil diubah");

      mutate("/api/admin/setting/get");

      setIsOpenEdit(false);
      setIsOpenWarning(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleSetNumber = (number: string) => {
    if (number.match(/[a-zA-Z!@#$&()\\=-`.+,/\"]/g)) {
      return null;
    }

    setBankNumber(number);
  };

  return (
    <React.Fragment>
      <div className="w-full h-fit bg-white rounded-md shadow-md">
        <div className="w-full border-b px-5 py-2 font-semibold text-xl">
          Akun Bank
        </div>
        <div className="w-full px-5 py-2">
          <SettingItem title="Nama Bank" value={data.bank ? data.bank : "-"} />
          <SettingItem
            title="Nama Pemilik"
            value={data.bankName ? data.bankName : "-"}
          />
          <SettingItem
            title="Nomor Rekening"
            value={data.bankNumber ? data.bankNumber : "-"}
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
                <DialogTitle>Ubah Data Bank</DialogTitle>
              </DialogHeader>

              <div className="w-full gap-3">
                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Nama Bank</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="mb-3"
                          placeholder="Isi nama bank (Bank Mandiri, Bank Rakyat Indonesia)"
                          {...field}
                          value={bank}
                          onChange={(e) => setBank(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Nama Pemilik Rek Bank
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="mb-3"
                          placeholder="Isi nama pemilik rekening"
                          {...field}
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">
                        Nomor Rekening
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="mb-3"
                          placeholder="Isi nomor rekening"
                          {...field}
                          value={bankNumber}
                          onChange={(e) => handleSetNumber(e.target.value)}
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

export default SettingBank;
