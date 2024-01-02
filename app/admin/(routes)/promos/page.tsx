"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import Title from "@/components/admin/Title";
import { PromoType } from "@/types/PromoType";
import PageLoading from "@/components/PageLoading";
import { ToastContainer, toast } from "react-toastify";
import ContentLoading from "@/components/ContentLoading";
import PromoTable from "@/components/admin/promo/PromoTable";
import React, { useCallback, useEffect, useState } from "react";

const Promos = () => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [promos, setPromos] = useState<PromoType[]>([]);
  const router = useRouter();

  const getPromos = useCallback(async () => {
    try {
      const res = await axios.get(`/api/admin/promos/get?page=1`);

      setPromos(res.data.data.promos);
      setIsLoadingContent(false);
    } catch (error: any) {
      setIsLoadingContent(false);
      toast.error(error.response.data.message);
    }
  }, []);

  const handleAddPromos = () => {
    setIsLoadingPage(true);
    router.push("/admin/promos/add");
  };

  useEffect(() => {
    getPromos();
  }, [getPromos]);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />

          <Title
            title="Promo"
            nameBtn="Tambah Promo"
            handleClick={handleAddPromos}
          />

          {isLoadingContent ? (
            <ContentLoading />
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-[80%]">
                <PromoTable
                  promos={promos}
                  setIsLoadingPage={setIsLoadingPage}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
};

export default Promos;
