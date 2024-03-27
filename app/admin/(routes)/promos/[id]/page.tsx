"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { PromoProductType, PromoType } from "@/types/PromoType";

const Title = dynamic(() => import("@/components/admin/Title"));
const NotFound = dynamic(() => import("@/components/admin/404"));
const PromoDetailContent = dynamic(
  () => import("@/components/admin/promo-detail/PromoDetailContent")
);

const PromoDetail = () => {
  const [promo, setPromo] = useState<PromoType>({
    createdAt: new Date(),
    description: "",
    firstPrice: 0,
    image: "",
    imagePathname: "",
    name: "",
    promoPrice: 0,
    slug: "",
    status: "active",
  });
  const [provisions, setProvisions] = useState<PromoProductType[]>([]);
  const [bonus, setBonus] = useState<PromoProductType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const params = useParams();

  const slug: string | string[] = params.id;

  const getPromo = useCallback(async () => {
    try {
      const res = await axios.get(`/api/admin/promos/${slug}/get`);

      setPromo(res.data.data);
      setProvisions(res.data.data.promoProductProvision);
      setBonus(res.data.data.promoProductBonus);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      if (error.response.status === 404) {
        setIsNotFound(true);
        setIsLoadingContent(false);
      }
    }
  }, []);

  useEffect(() => {
    getPromo();
  }, [getPromo]);

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

          {isNotFound ? (
            <NotFound />
          ) : isLoadingContent ? (
            <ContentLoading />
          ) : (
            <PromoDetailContent
              getPromo={getPromo}
              promo={promo}
              provisions={provisions}
              bonus={bonus}
            />
          )}
        </div>
      </section>
    );
  }
};

export default PromoDetail;
