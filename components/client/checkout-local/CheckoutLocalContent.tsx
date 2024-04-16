"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cashDesc, transferDesc } from "@/constant/CheckoutPaymentDesc";
import { useCartContext } from "@/context/CartContext";
import AutosizeTextArea from "@/utils/AutosizeTextArea";
import { ValidatePhoneNumber } from "@/utils/ValidatePhoneNumber";
import { zodResolver } from "@hookform/resolvers/zod";

import Alert from "../Alert";
import SelectInterCodePhone from "../SelectInterCodePhone";
import CheckoutLocalTable from "./CheckoutLocalTable";
import CheckoutLocalTotal from "./CheckoutLocalTotal";

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(3, "First name minimum 3 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(3, "Last name minimum 3 characters"),
  phone: z
    .boolean()
    .refine((bool) => bool === true, "Phone number is not valid"),
  email: z.string().min(1, "Email is required").email(),
  address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address is too short"),
  note: z.string().optional(),
  paymentMethod: z.string().min(1, "You need to select a payment method"),
});

const CheckoutLocalContent = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [validPhone, setValidPhone] = useState<boolean>(false);
  const [phoneCode, setPhoneCode] = useState<string>("+62");
  const [isOpenPhoneCode, setIsOpenPhoneCode] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenWarningAlert, setIsOpenWarningAlert] = useState<boolean>(false);
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState<boolean>(false);

  const { carts, handleSetCarts } = useCartContext();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  AutosizeTextArea(textAreaRef.current, note);

  const { handleCheckPhoneNumber } = ValidatePhoneNumber();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: firstName,
      lastName: lastName,
      phone: validPhone,
      email: email,
      address: address,
      note: note,
      paymentMethod: paymentMethod,
    },
  });

  const handleSetNumber = (number: string) => {
    if (number.match(/[a-zA-Z!@#$&()\\-`.+,/\"]/g)) {
      return null;
    } else if (number.charAt(0) === "0") {
      return null;
    }

    setPhone(number);
    handleCheckPhoneNumber(number, setValidPhone);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsOpenWarningAlert(true);
  };

  const handlePush = async () => {
    try {
      setIsLoading(true);

      const filterCartsTrue = carts.filter((cart) => cart.status === true);

      await axios.post("/api/checkout/post", {
        firstName,
        lastName,
        phone: phoneCode + phone,
        email,
        address,
        note,
        paymentMethod,
        carts: filterCartsTrue,
      });

      setIsOpenSuccessAlert(true);

      setIsLoading(false);
      setIsOpenWarningAlert(false);

      const filterCartsFalse = carts.filter((cart) => cart.status === false);

      handleSetCarts(filterCartsFalse);

      await axios.get("/api/telegram/get");
    } catch (error: any) {
      toast.error(error.response.data.message);

      setIsLoading(false);
      setIsOpenWarningAlert(false);
    }
  };

  const handleBack = () => {
    router.push("/cart");
    setIsLoading(true);
  };
  return (
    <React.Fragment>
      <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-488px)] lg:mt-[150px] md:mt-[100px] mt-[80px]">
        <div className="w-full text-center text-2xl font-serif font-semibold mb-3 capitalize">
          Checkout
        </div>

        <div className="w-full flex justify-center mt-10 font-serif">
          <div className="lg:w-[80%] w-[90%]">
            <CheckoutLocalTable />

            <div className="text-xl font-medium mt-10 mb-5">
              Billing & Shipping
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="w-full grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-700">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="mb-3"
                            placeholder="Input first name"
                            {...field}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-700">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="mb-3"
                            placeholder="Input last name"
                            {...field}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-gray-700">Phone</FormLabel>
                        <FormControl>
                          <div className="w-full flex gap-2">
                            <SelectInterCodePhone
                              isOpen={isOpenPhoneCode}
                              setIsOpen={setIsOpenPhoneCode}
                              phoneCode={phoneCode}
                              setPhoneCode={setPhoneCode}
                            />
                            <Input
                              type="text"
                              className="mb-3 !flex-1"
                              placeholder="Input your phone"
                              {...field}
                              value={phone}
                              onChange={(e) => handleSetNumber(e.target.value)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Address</FormLabel>
                      <FormControl>
                        <Textarea
                          className="mb-3 resize-none"
                          placeholder="Input your specific address"
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

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Note</FormLabel>
                      <FormControl>
                        <Textarea
                          className="mb-3 resize-none"
                          placeholder="Input note (optional)"
                          {...field}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          ref={textAreaRef}
                          rows={1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-5">
                  <CheckoutLocalTotal />

                  <div className="w-full">
                    <div className="w-full h-fit p-4 font-serif text-gray-600 border rounded-md text-sm">
                      <div className="text-lg font-semibold">
                        Payment Method
                      </div>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormControl>
                              <RadioGroup
                                onValueChange={setPaymentMethod}
                                value={paymentMethod}
                              >
                                <FormItem className="flex items-center gap-3 mb-2">
                                  <FormControl>
                                    <RadioGroupItem value="cash" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Cash
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-3">
                                  <FormControl>
                                    <RadioGroupItem value="transfer" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Transfer
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage className="!mt-2 !mb-0" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-2 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? <ButtonLoading /> : "Place an order"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

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

export default CheckoutLocalContent;
