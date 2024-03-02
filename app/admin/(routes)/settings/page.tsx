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
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import ContentLoading from "@/components/ContentLoading";

const Setting = () => {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

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
    createdAt: null,
    updatedAt: null,
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

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <div className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />

          <Title title="Pengaturan" />

          {isLoadingContent ? (
            <ContentLoading />
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
  }
};

export default Setting;
