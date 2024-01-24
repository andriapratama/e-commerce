"use client";

import Title from "@/components/admin/Title";
import SettingBank from "@/components/admin/setting/SettingBank";
import SettingContact from "@/components/admin/setting/SettingContact";
import SettingLogo from "@/components/admin/setting/SettingLogo";
import SettingSosmed from "@/components/admin/setting/SettingSosmed";
import { SettingType } from "@/types/admin/SettingType";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import AdminLoading from "../loading";

const Setting = () => {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [data, setData] = useState<SettingType>({
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
    createdAt: undefined,
    updatedAt: undefined,
  });

  const getSetting = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/setting/get");

      setData(res.data.data);
      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <div className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />

        <Title title="Pengaturan" />

        {isLoadingContent ? (
          <AdminLoading />
        ) : (
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-5">
            <SettingLogo data={data} getSetting={getSetting} />
            <SettingContact data={data} getSetting={getSetting} />
            <SettingSosmed data={data} getSetting={getSetting} />
            <SettingBank data={data} getSetting={getSetting} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
