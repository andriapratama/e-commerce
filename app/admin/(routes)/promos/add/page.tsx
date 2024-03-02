"use client";

import PageLoading from "@/components/PageLoading";
import Title from "@/components/admin/Title";
import PromoAddForm from "@/components/admin/promo-add/PromoAddForm";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

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
