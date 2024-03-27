"use client";

import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";

const Title = dynamic(() => import("@/components/admin/Title"));
const PromoAddForm = dynamic(
  () => import("@/components/admin/promo-add/PromoAddForm")
);

const PromosAdd = () => {
  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />
          <Title title="Tambah Promo" />

          <PromoAddForm />
        </div>
      </section>
    );
  }
};

export default PromosAdd;
