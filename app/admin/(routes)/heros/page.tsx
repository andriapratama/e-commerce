"use client";

import axios from "axios";
import Title from "@/components/admin/Title";
import HeroAdd from "@/components/admin/hero/HeroAdd";
import HeroTable from "@/components/admin/hero/HeroTable";
import { ToastContainer, toast } from "react-toastify";
import React, { useCallback, useEffect, useState } from "react";
import { HeroType } from "@/types/HeroType";

const Heros = () => {
  const [heros, setHeros] = useState<HeroType[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

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

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />
        <Title title="Heros" />

        <HeroAdd getHeros={getHeros} />

        <HeroTable heros={heros} setHeros={setHeros} getHeros={getHeros} />
      </div>
    </section>
  );
};

export default Heros;
