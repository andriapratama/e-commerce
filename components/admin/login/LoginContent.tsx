"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import ButtonLoading from "@/components/ButtonLoading";

const formSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username harus diisi.",
    })
    .min(2, {
      message: "Username minimal harus 2 karakter.",
    }),
  password: z
    .string()
    .min(1, {
      message: "Password harus diisi.",
    })
    .min(6, {
      message: "Password minimal harus 6 karakter.",
    }),
});

const LoginContent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        role: "admin",
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/admin/orders");
      } else {
        toast.error(res?.error);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[300px] h-auto p-5 border rounded-md"
      >
        <ToastContainer />
        <h1 className="text-2xl font-bold mb-5">Admin Login</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="!rounded-lg"
                  type="text"
                  placeholder="Username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="!mt-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="!rounded-lg"
                  type="password"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full mt-5 !rounded-full"
          type="submit"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? <ButtonLoading /> : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginContent;
