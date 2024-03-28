"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { Fetcher } from "swr";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { OrdersType } from "@/types/admin/OrderType";

const Title = dynamic(() => import("@/components/admin/Title"));
const OrderFilter = dynamic(
  () => import("@/components/admin/order/OrderFilter")
);
const OrderTable = dynamic(() => import("@/components/admin/order/OrderTable"));

const Orders = () => {
  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [route, setRoute] = useState<string>("");

  const searchParams = useSearchParams();

  const searchValue = searchParams.get("search");
  const statusParams = searchParams.get("status");
  const pageParams = searchParams.get("page");

  const fetcher: Fetcher<{
    data: { orders: OrdersType[]; totalPage: number } | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(route, fetcher);

  useEffect(() => {
    const api: string = "/api/admin/orders/get";

    if (searchValue) {
      setRoute(`${api}?search=${searchValue}`);
    } else if (statusParams) {
      setRoute(`${api}?status=${statusParams}&page=${pageParams}`);
    } else if (pageParams) {
      setRoute(`${api}?page=${pageParams}`);
    } else {
      setRoute(`${api}`);
    }
  }, [searchValue, statusParams, pageParams]);

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

          <Title title="Orders" />

          <OrderFilter />

          {isLoading ? (
            <ContentLoading />
          ) : (
            <OrderTable
              orders={data?.data?.orders}
              setIsLoadingPage={setIsLoadingPage}
              totalPage={data?.data?.totalPage}
            />
          )}
        </div>
      </section>
    );
  }
};

export default Orders;
