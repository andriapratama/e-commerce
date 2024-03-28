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
import { ProductSoldType } from "@/types/ProductType";
import { ConvertDateId } from "@/utils/ConvertDateId";
import { ConvertIDR } from "@/utils/ConvertIDR";

const Title = dynamic(() => import("@/components/admin/Title"));
const DashboardCard = dynamic(
  () => import("@/components/admin/dashboard/DashboardCard")
);
const DashboardProductMinStock = dynamic(
  () => import("@/components/admin/dashboard/DashboardProductMinStock")
);
const DashboardProductSold = dynamic(
  () => import("@/components/admin/dashboard/DashboardProductSold")
);
const DashboardSetDate = dynamic(
  () => import("@/components/admin/dashboard/DashboardSetDate")
);

interface DashboardType {
  countTotalProductSold: number;
  totalProductSold: ProductSoldType[];
  totalSales: { sales: number; profit: number };
  totalTransaction: number;
}

const Dashboard = () => {
  const [route, setRoute] = useState<string>("");

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");
  const dateParams = searchParams.get("date");
  const monthParams = searchParams.get("month");
  const yearParams = searchParams.get("year");
  const productPageParams = searchParams.get("product-page");

  const fetcher: Fetcher<{
    data: DashboardType | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(route, fetcher);

  useEffect(() => {
    const api: string = "/api/admin/dashboard/get";

    const today = new Date();

    const page = productPageParams ? productPageParams : 1;

    if (typeParams === "yearly" && yearParams) {
      setRoute(`${api}?type=yearly&year=${yearParams}&product-page=${page}`);
    } else if (typeParams === "monthly") {
      setRoute(
        `${api}?type=monthly&year=${yearParams}&month=${monthParams}&product-page=${page}`
      );
    } else if (typeParams === "daily") {
      setRoute(`${api}?type=daily&date=${dateParams}&product-page=${page}`);
    } else {
      setRoute(
        `${api}?type=daily&date=${
          ConvertDateId(today).fullDateNumber
        }&product-page=${page}`
      );
    }
  }, [typeParams, yearParams, monthParams, dateParams, productPageParams]);

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

          <Title title="Dashboard" />

          {isLoading ? (
            <ContentLoading />
          ) : (
            <>
              <DashboardSetDate />

              <div className="w-full grid grid-cols-3 gap-5 mb-5">
                <DashboardCard
                  title="Total Pesanan"
                  value={
                    data?.data?.totalTransaction
                      ? `${data.data.totalTransaction} pesanan`
                      : "0"
                  }
                />
                <DashboardCard
                  title="Total Penjualan"
                  value={ConvertIDR(
                    data?.data?.totalSales.sales
                      ? data?.data?.totalSales.sales
                      : 0
                  )}
                />
                <DashboardCard
                  title="Total Keuntungan"
                  value={ConvertIDR(
                    data?.data?.totalSales.profit
                      ? data?.data?.totalSales.profit
                      : 0
                  )}
                />
              </div>

              <div className="w-full grid grid-cols-2 gap-5">
                <DashboardProductSold
                  productsSold={data?.data?.totalProductSold}
                  totalPage={data?.data?.countTotalProductSold}
                />
                <DashboardProductMinStock />
              </div>
            </>
          )}
        </div>
      </section>
    );
  }
};

export default Dashboard;
