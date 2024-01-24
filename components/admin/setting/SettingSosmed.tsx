"use client";

import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import WarningAlert from "../WarningAlert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingType } from "@/types/admin/SettingType";
import React, { useEffect, useState } from "react";
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
import {
  ValidatePhoneNumber,
  InterPhoneCodes,
} from "@/utils/ValidatePhoneNumber";
import ProfileSelectInterCodePhone from "@/components/client/profile/ProfileSelectInterCodePhone";
import SettingItem from "./SettingItem";

const formSchema = z.object({
  whatsapp: z
    .boolean()
    .refine((bool) => bool === true, "Phone number is not valid"),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
});

interface Props {
  data: SettingType;
  getSetting: () => void;
}

const SettingSosmed: React.FC<Props> = ({ data, getSetting }) => {
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenWarning, setIsOpenWarning] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [validPhone, setValidPhone] = useState<boolean>(false);
  const [phoneCode, setPhoneCode] = useState<string>("");
  const [isOpenPhoneCode, setIsOpenPhoneCode] = useState<boolean>(false);

  const { handleCheckPhoneNumber } = ValidatePhoneNumber();

  const findPhoneNumber = () => {
    const dataWhatsapp = data.whatsapp ? data.whatsapp : "";

    setValidPhone(true);

    if (dataWhatsapp) {
      let code = "";

      for (let i = 0; i < InterPhoneCodes.length; i++) {
        if (dataWhatsapp.startsWith(InterPhoneCodes[i].code)) {
          code = InterPhoneCodes[i].code;
        }
      }

      setPhoneCode(code);

      const cleanPhoneNumber = dataWhatsapp.replace(code, "");

      setWhatsapp(cleanPhoneNumber);
    } else {
      setPhoneCode("+62");
      setWhatsapp("");
    }
  };

  useEffect(() => {
    findPhoneNumber();
    setInstagram(data.instagram ? data.instagram : "");
    setTwitter(data.twitter ? data.twitter : "");
    setFacebook(data.facebook ? data.facebook : "");
  }, [data]);

  const handleSetNumber = (number: string) => {
    if (number.match(/[a-zA-Z!@#$&()\\-`.+,/\"]/g)) {
      return null;
    } else if (number.charAt(0) === "0") {
      return null;
    }

    setWhatsapp(number);
    handleCheckPhoneNumber(number, setValidPhone);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      whatsapp: validPhone,
      instagram: instagram,
      twitter: twitter,
      facebook: facebook,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      phoneCode + whatsapp !== data.whatsapp ||
      values.instagram !== data.instagram ||
      values.twitter !== data.twitter ||
      values.facebook !== data.facebook
    ) {
      setIsOpenWarning(true);
    } else {
      setIsOpenEdit(false);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/admin/setting/sosmed/patch?id=${data.id}`, {
        whatsapp: phoneCode + whatsapp,
        instagram,
        twitter,
        facebook,
      });

      toast.success("Data sosmed berhasil diubah");

      getSetting();

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
          Social Media
        </div>
        <div className="w-full px-5 py-2">
          <SettingItem
            title="WhatsApp"
            value={data.whatsapp ? data.whatsapp : "-"}
          />
          <SettingItem
            title="Instagram"
            value={data.instagram ? data.instagram : "-"}
          />
          <SettingItem
            title="Twitter"
            value={data.twitter ? data.twitter : "-"}
          />
          <SettingItem
            title="Facebook"
            value={data.facebook ? data.facebook : "-"}
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
        <DialogContent className="sm:max-w-[200px] lg:max-w-[300px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <DialogHeader className="mb-5">
                <DialogTitle>Ubah Data Kontak</DialogTitle>
              </DialogHeader>

              <div className="w-full gap-3">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">WhatsApp</FormLabel>
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
                            placeholder="Isi nomor whatsapp"
                            {...field}
                            value={whatsapp}
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
                  name="instagram"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Instagram</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="mb-3"
                          placeholder="Isi link instagram"
                          {...field}
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Twitter</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="mb-3"
                          placeholder="Isi link twitter"
                          {...field}
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-gray-700">Facebook</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="mb-3"
                          placeholder="Isi link facebook"
                          {...field}
                          value={facebook}
                          onChange={(e) => setFacebook(e.target.value)}
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

export default SettingSosmed;
