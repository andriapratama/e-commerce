"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { PromoType } from "@/types/PromoType";

const Title = dynamic(() => import("@/components/admin/Title"));
const PromoTable = dynamic(() => import("@/components/admin/promo/PromoTable"));

const Promos = () => {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [promos, setPromos] = useState<PromoType[]>([]);
  const router = useRouter();

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

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
