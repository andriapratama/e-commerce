"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { Fetcher } from "swr";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { PromoType } from "@/types/PromoType";

const Title = dynamic(() => import("@/components/admin/Title"));
const PromoTable = dynamic(() => import("@/components/admin/promo/PromoTable"));

const Promos = () => {
  const [route, setRoute] = useState<string>("");

  const router = useRouter();

  const searchParams = useSearchParams();

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const pageParams = searchParams.get("page");

  const pageNow = parseInt(pageParams ? pageParams : "1");

  const fetcher: Fetcher<{
    data: { promos: PromoType[]; totalPage: number } | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(route, fetcher);

  const handleAddPromos = () => {
    setIsLoadingPage(true);
    router.push("/admin/promos/add");
  };

  useEffect(() => {
    setRoute(`/api/admin/promos/get?page=${pageNow}`);
  }, [pageNow]);

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

          {isLoading ? (
            <ContentLoading />
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-[80%]">
                <PromoTable
                  promos={data?.data?.promos}
                  setIsLoadingPage={setIsLoadingPage}
                  totalPage={data?.data?.totalPage}
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
