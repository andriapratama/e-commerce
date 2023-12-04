"use client";

import axios from "axios";
import Title from "@/components/admin/Title";
import PageLoading from "@/components/PageLoading";
import { OrdersType } from "@/types/admin/OrderType";
import ContentLoading from "@/components/ContentLoading";
import OrderTable from "@/components/admin/order/OrderTable";
import React, { useCallback, useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const getOrders = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/orders/get");

      setOrders(res.data.data);

      setIsLoadingContent(false);
    } catch (error) {
      console.log(error);
      setIsLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <Title title="Orders" />

          {isLoadingContent ? (
            <ContentLoading />
          ) : (
            <OrderTable orders={orders} setIsLoadingPage={setIsLoadingPage} />
          )}
        </div>
      </section>
    );
  }
};

export default Orders;
