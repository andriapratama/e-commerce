import { SettingType } from "@/types/admin/SettingType";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useGetSettingHook = () => {
  const [setting, setSetting] = useState<SettingType>({
    id: "",
    image: "",
    imagePathname: "",
    email: "",
    address: "",
    whatsapp: "",
    instagram: "",
    twitter: "",
    facebook: "",
    bank: "",
    bankName: "",
    bankNumber: "",
    createdAt: null,
    updatedAt: null,
  });

  const getSetting = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/setting/get");

      setSetting(res.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    getSetting();
  }, []);

  return {
    setting,
    setSetting,
    getSetting,
  };
};
