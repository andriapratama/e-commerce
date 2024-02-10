"use client";

import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import WarningAlert from "../WarningAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonLoading from "@/components/ButtonLoading";
import React, { Dispatch, SetStateAction, useState } from "react";
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

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Password lama harus diisi")
      .min(6, "Password lama minimal 6 karakter"),
    newPassword: z
      .string()
      .min(1, "Password baru harus diisi")
      .min(6, "Password baru minimal 6 karakter"),
    confirmNewPassword: z
      .string()
      .min(1, "Konfirmasi password baru harus diisi")
      .min(6, "Konfirmasi password baru minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password baru dan konfirmasi password harus sama",
    path: ["confirmNewPassword"],
  });

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const NavbarChangePassword: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpenWarning(true);
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/employees/password/patch`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      toast.success("Password berhasil diubah");

      setIsOpen(false);
      setIsOpenWarning(false);
      setIsLoading(false);

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent className="w-full sm:w-[300px] md:w-[400px] max-h-[90vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Ganti Password</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">
                      Password Lama
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="mb-3"
                        placeholder="Masukan password lama"
                        {...field}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">
                      Password Baru
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="mb-3"
                        placeholder="Masukan password baru"
                        {...field}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">
                      Konfirmasi Password Baru
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="mb-3"
                        placeholder="Masukan konfirmasi password baru"
                        {...field}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
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

export default NavbarChangePassword;
