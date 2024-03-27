"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { HeroType } from "@/types/HeroType";

const Title = dynamic(() => import("@/components/admin/Title"));
const HeroAdd = dynamic(() => import("@/components/admin/hero/HeroAdd"));
const HeroTable = dynamic(() => import("@/components/admin/hero/HeroTable"));

const Heros = () => {
  const [heros, setHeros] = useState<HeroType[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const getHeros = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/hero/get");

      setHeros(res.data.data);

      setIsLoadingContent(false);
    } catch (error: any) {
      setIsLoadingContent(false);
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    getHeros();
  }, [getHeros]);

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
          <Title title="Heros" />

          <HeroAdd getHeros={getHeros} />

          {isLoadingContent ? (
            <ContentLoading />
          ) : (
            <HeroTable heros={heros} setHeros={setHeros} getHeros={getHeros} />
          )}
        </div>
      </section>
    );
  }
};

export default Heros;
