"use client";

import ButtonLoading from "@/components/ButtonLoading";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password minimum 6 characters"),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        role: "user",
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.ok) {
        router.push("/");
        router.refresh();
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
      <ToastContainer />

      <div className="w-full text-center lg:mt-[150px] md:mt-[100px] mt-[80px] text-2xl font-semibold">
        Login
      </div>

      <div className="w-full flex justify-center lg:min-h-[calc(100vh-569px)] md:min-h-[calc(100vh-519px)] min-h-[calc(100vh-163px)]">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full sm:w-[300px] md:w-[400px] px-5 pt-3 h-fit rounded border mt-[20px]"
        >
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
                    placeholder="Input valid email"
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
              <FormItem className="w-full">
                <FormLabel className="text-gray-700">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="mb-3"
                    placeholder="Input password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mb-3" disabled={isLoading}>
            {isLoading ? <ButtonLoading /> : "Login"}
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default LoginForm;
