"use client";

import ContentLoading from "@/components/ContentLoading";
import NotFound from "@/components/admin/404";
import Title from "@/components/admin/Title";
import PromoDetailContent from "@/components/admin/promo-detail/PromoDetailContent";
import { PromoProductType, PromoType } from "@/types/PromoType";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const PromoDetail = () => {
  const [promo, setPromo] = useState<PromoType>({
    createdAt: "",
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
};

export default PromoDetail;
