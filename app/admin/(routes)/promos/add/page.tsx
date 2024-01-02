"use client";

import Title from "@/components/admin/Title";
import PromoAddForm from "@/components/admin/promo-add/PromoAddForm";
import React from "react";
import { ToastContainer } from "react-toastify";

const PromosAdd = () => {
  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />
        <Title title="Tambah Promo" />

        <PromoAddForm />
      </div>
    </section>
  );
};

export default PromosAdd;
