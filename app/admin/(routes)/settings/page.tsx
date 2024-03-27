"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { SettingType } from "@/types/admin/SettingType";

const Title = dynamic(() => import("@/components/admin/Title"));
const SettingBank = dynamic(
  () => import("@/components/admin/setting/SettingBank")
);
const SettingContact = dynamic(
  () => import("@/components/admin/setting/SettingContact")
);
const SettingLogo = dynamic(
  () => import("@/components/admin/setting/SettingLogo")
);
const SettingSosmed = dynamic(
  () => import("@/components/admin/setting/SettingSosmed")
);

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
