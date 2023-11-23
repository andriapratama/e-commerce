"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "@/components/ButtonLoading";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import axios from "axios";

const formSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Old password is required")
      .min(6, "Old password minimum 6 characters"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(6, "New password minimum 6 characters"),
    confirmNewPassword: z
      .string()
      .min(1, "Confirm new password is required")
      .min(3, "Confirm new password minimum 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Confirm new password don't match",
    path: ["confirmNewPassword"],
  });

interface ProfileChangePasswordProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  email: string;
}

const ProfileChangePassword: React.FC<ProfileChangePasswordProps> = ({
  isOpen,
  setIsOpen,
  email,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const res = await axios.patch(`/api/users/${email}/change-password`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast.success(res.data.message);

      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full sm:w-[300px] md:w-[400px] max-h-[90vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Edit Data</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="mb-3"
                        placeholder="Input old password"
                        {...field}
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
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="mb-3"
                        placeholder="Input new password"
                        {...field}
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
                      Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="mb-3"
                        placeholder="Input confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <ButtonLoading /> : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ProfileChangePassword;
