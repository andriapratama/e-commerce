"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";
import ButtonLoading from "@/components/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PageLoading from "@/components/PageLoading";

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
  const session = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (
      session.status === "unauthenticated" ||
      session.data?.user.role === "member"
    ) {
      setIsLoadingPage(false);
    }
  }, [session]);

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

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
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
  }
};

export default LoginContent;
