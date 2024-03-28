"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { Fetcher } from "swr";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { PromoProductType, PromoType } from "@/types/PromoType";

const Title = dynamic(() => import("@/components/admin/Title"));
const PromoDetailContent = dynamic(
  () => import("@/components/admin/promo-detail/PromoDetailContent")
);

interface Promo extends PromoType {
  promoProductBonus: PromoProductType[];
  promoProductProvision: PromoProductType[];
}

const PromoDetail = () => {
  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const params = useParams();

  const slug: string | string[] = params.id;

  const fetcher: Fetcher<{
    data: Promo | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(`/api/admin/promos/${slug}/get`, fetcher);

  useEffect(() => {
    setIsLoadingPage(false);
  });

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />

          <Title title="Detail Promo" />

          {isLoading ? (
            <ContentLoading />
          ) : (
            <PromoDetailContent
              promo={data?.data}
              provisions={data?.data?.promoProductProvision}
              bonus={data?.data?.promoProductBonus}
            />
          )}
        </div>
      </section>
    );
  }
};

export default PromoDetail;
