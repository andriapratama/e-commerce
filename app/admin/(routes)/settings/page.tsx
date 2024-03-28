"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { useGetSettingHook } from "@/hooks/admin/SettingHook";

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
  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const { setting, isLoadingContent } = useGetSettingHook();

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
              <SettingLogo data={setting} />
              <SettingContact data={setting} />
              <SettingSosmed data={setting} />
              <SettingBank data={setting} />
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Setting;
