"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ButtonLoading from "@/components/ButtonLoading";
import Alert from "../Alert";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface CheckoutPaymentProps {
  note: string;
}

const FormSchema = z.object({
  paymentMethod: z.enum(["cash", "transfer"], {
    required_error: "You need to select a payment method.",
  }),
});

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({ note }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenWarningAlert, setIsOpenWarningAlert] = useState<boolean>(false);
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const cashDesc =
    "Your order is being processed, an invoice will be sent to email or WhatsApp to continue payment.";
  const transferDesc =
    "Your order is being processed, an invoice will be sent to email or WhatsApp and the product will be sent according to the address.";

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    if (values.paymentMethod) {
      setIsOpenWarningAlert(true);
      setPaymentMethod(values.paymentMethod);
    }
  };

  const handlePush = async () => {
    try {
      setIsLoading(true);

      const resOrder = await axios.post("/api/order", {
        paymentMethod,
        note,
      });

      if (resOrder.status === 201) {
        setIsOpenSuccessAlert(true);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
      setIsOpenWarningAlert(false);
    }
  };

  const handleBack = () => {
    router.push("/cart");
    router.refresh();
    setIsLoading(true);
  };

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full h-fit p-4 font-serif text-gray-600 border rounded-md text-sm">
            <div className="text-lg font-semibold">Payment Method</div>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem className="flex items-center gap-3 mb-2">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal">Cash</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="transfer" />
                        </FormControl>
                        <FormLabel className="font-normal">Transfer</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="!mt-2 !mb-0" />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
            {isLoading ? <ButtonLoading /> : "Place an order"}
          </Button>
        </form>
      </Form>

      <Alert
        status="warning"
        title="Are you absolutely sure?"
        desc="Double check your order. If so, click continue to process your order."
        isOpen={isOpenWarningAlert}
        setIsOpen={setIsOpenWarningAlert}
        handlePush={handlePush}
        isLoading={isLoading}
      />

      <Alert
        status="success"
        title="Thanks for your order"
        desc={paymentMethod === "cash" ? cashDesc : transferDesc}
        isOpen={isOpenSuccessAlert}
        setIsOpen={setIsOpenSuccessAlert}
        handlePush={handleBack}
        isLoading={isLoading}
      />
    </React.Fragment>
  );
};

export default CheckoutPayment;
