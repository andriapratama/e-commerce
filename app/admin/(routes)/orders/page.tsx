"use client";

import axios from "axios";
import Title from "@/components/admin/Title";
import PageLoading from "@/components/PageLoading";
import { OrdersType } from "@/types/admin/OrderType";
import ContentLoading from "@/components/ContentLoading";
import OrderTable from "@/components/admin/order/OrderTable";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import OrderFilter from "@/components/admin/order/OrderFilter";

const Orders = () => {
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(0);

  const searchParams = useSearchParams();

  const searchValue = searchParams.get("search");
  const statusParams = searchParams.get("status");
  const pageParams = searchParams.get("page");

  const getOrders = useCallback(async () => {
    try {
      const api: string = "/api/admin/orders/get";

      let router: string = "";

      if (searchValue) {
        router = `${api}?search=${searchValue}`;
      } else if (statusParams) {
        router = `${api}?status=${statusParams}&page=${pageParams}`;
      } else if (pageParams) {
        router = `${api}?page=${pageParams}`;
      } else {
        router = `${api}`;
      }

      const res = await axios.get(router);

      setOrders(res.data.data.orders);
      setTotalPage(res.data.data.totalPage);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingContent(false);
    }
  }, [searchValue, statusParams, pageParams]);

  useEffect(() => {
    getOrders();
  }, [searchValue, statusParams, pageParams]);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />

          <Title title="Orders" />

          <OrderFilter setIsLoadingContent={setIsLoadingContent} />

          {isLoadingContent ? (
            <ContentLoading />
          ) : (
            <OrderTable
              orders={orders}
              setIsLoadingPage={setIsLoadingPage}
              setIsLoadingContent={setIsLoadingContent}
              totalPage={totalPage}
            />
          )}
        </div>
      </section>
    );
  }
};

export default Orders;
