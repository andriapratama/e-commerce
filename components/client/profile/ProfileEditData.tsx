"use client";

import { UserType } from "@/types/UserType";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  InterPhoneCodes,
  ValidatePhoneNumber,
} from "@/utils/ValidatePhoneNumber";
import ProfileSelectInterCodePhone from "./ProfileSelectInterCodePhone";
import useAutosizeTextArea from "@/utils/AutosizeTextArea";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ButtonLoading from "@/components/ButtonLoading";

interface ProfileEditDataProps {
  user: UserType;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

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
  address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address is too short"),
});

const ProfileEditData: React.FC<ProfileEditDataProps> = ({
  user,
  isOpen,
  setIsOpen,
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [validPhone, setValidPhone] = useState<boolean>(false);
  const [phoneCode, setPhoneCode] = useState<string>("");
  const [isOpenPhoneCode, setIsOpenPhoneCode] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const { handleCheckPhoneNumber } = ValidatePhoneNumber();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, address);

  const findPhoneNumber = () => {
    const userPhone = user.phone;

    if (userPhone) {
      let code = "";

      for (let i = 0; i < InterPhoneCodes.length; i++) {
        if (userPhone.startsWith(InterPhoneCodes[i].code)) {
          code = InterPhoneCodes[i].code;
        }
      }

      setPhoneCode(code);

      const cleanPhoneNumber = userPhone.replace(code, "");

      setPhone(cleanPhoneNumber);
    } else {
      setPhoneCode("+62");
      setPhone("");
    }
  };

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAddress(user.address === null ? "" : user.address);
    findPhoneNumber();
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: firstName,
      lastName: lastName,
      phone: validPhone,
      address: address,
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

  const handleClose = () => {
    setIsOpen(false);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAddress(user.address === null ? "" : user.address);
    findPhoneNumber();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      firstName !== user.firstName ||
      lastName !== user.lastName ||
      phoneCode + phone !== user.phone ||
      address !== user.address
    ) {
      handleStoreData();
    } else {
      setIsOpen(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      const res = await axios.patch(`/api/users/${user.email}`, {
        firstName,
        lastName,
        phone: phoneCode + phone,
        address,
      });

      toast.success(res.data.message);

      setIsOpen(false);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setAddress(user.address === null ? "" : user.address);
      findPhoneNumber();

      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onOpenChange={isLoading ? () => setIsOpen(true) : handleClose}
      >
        <DialogContent className="w-full sm:w-[300px] md:w-[400px] max-h-[90vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Edit Data</DialogTitle>
              </DialogHeader>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">First Name</FormLabel>
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
                    <FormLabel className="text-gray-700">Last Name</FormLabel>
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-700">Phone</FormLabel>
                    <FormControl>
                      <div className="w-full flex gap-2">
                        <ProfileSelectInterCodePhone
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

export default ProfileEditData;
