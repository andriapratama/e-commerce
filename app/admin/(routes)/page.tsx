"use client";

import axios from "axios";
import Title from "@/components/admin/Title";
import { ConvertIDR } from "@/utils/ConvertIDR";
import { useSearchParams } from "next/navigation";
import { ConvertDateId } from "@/utils/ConvertDateId";
import { ToastContainer, toast } from "react-toastify";
import ContentLoading from "@/components/ContentLoading";
import React, { useCallback, useEffect, useState } from "react";
import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import { ProductMinStockType, ProductSoldType } from "@/types/ProductType";
import DashboardSetDate from "@/components/admin/dashboard/DashboardSetDate";
import DashboardProductSold from "@/components/admin/dashboard/DashboardProductSold";
import DashboardProductMinStock from "@/components/admin/dashboard/DashboardProductMinStock";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import PageLoading from "@/components/PageLoading";

const Dashboard = () => {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);
  const [profit, setProfit] = useState<number>(0);
  const [sales, setSales] = useState<number>(0);
  const [transaction, setTrasanction] = useState<number>(0);
  const [productsSold, setProductsSold] = useState<ProductSoldType[]>([]);
  const [productsMinStock, setProductsMinStock] = useState<
    ProductMinStockType[]
  >([]);
  const [totalProductPage, setTotalProductPage] = useState<number>(0);
  const [isLoadingProductContent, setIsLoadingProductContent] =
    useState<boolean>(false);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");
  const dateParams = searchParams.get("date");
  const monthParams = searchParams.get("month");
  const yearParams = searchParams.get("year");
  const productPageParams = searchParams.get("product-page");

  const getData = useCallback(async () => {
    try {
      const api: string = "/api/admin/dashboard/get";

      let route: string = "";

      const today = new Date();

      const page = productPageParams ? productPageParams : 1;

      if (typeParams === "yearly" && yearParams) {
        route = `${api}?type=yearly&year=${yearParams}&product-page=${page}`;
      } else if (typeParams === "monthly") {
        route = `${api}?type=monthly&year=${yearParams}&month=${monthParams}&product-page=${page}`;
      } else if (typeParams === "daily") {
        route = `${api}?type=daily&date=${dateParams}&product-page=${page}`;
      } else {
        route = `${api}?type=daily&date=${
          ConvertDateId(today).fullDateNumber
        }&product-page=${page}`;
      }

      const res = await axios.get(route);

      const data = res.data.data;

      setProductsSold(data.totalProductSold);
      setProfit(data.totalSales.profit);
      setSales(data.totalSales.sales);
      setTrasanction(data.totalTransaction);
      setTotalProductPage(data.countTotalProductSold);

      setIsLoadingContent(false);
      setIsLoadingProductContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingContent(false);
    }
  }, [typeParams, yearParams, monthParams, dateParams, productPageParams]);

  useEffect(() => {
    getData();
  }, [typeParams, yearParams, monthParams, dateParams, productPageParams]);

  const getProductsMinStock = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/products/min-stock/get");

      setProductsMinStock(res.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    getProductsMinStock();
  }, []);

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

          {isLoadingContent ? (
            <ContentLoading />
          ) : (
            <>
              <DashboardSetDate />

              <div className="w-full grid grid-cols-3 gap-5 mb-5">
                <DashboardCard
                  title="Total Pesanan"
                  value={transaction ? `${transaction} pesanan` : "0"}
                />
                <DashboardCard
                  title="Total Penjualan"
                  value={ConvertIDR(sales)}
                />
                <DashboardCard
                  title="Total Keuntungan"
                  value={ConvertIDR(profit)}
                />
              </div>

              <div className="w-full grid grid-cols-2 gap-5">
                <DashboardProductSold
                  productsSold={productsSold}
                  totalPage={totalProductPage}
                  isLoadingProductContent={isLoadingProductContent}
                  setIsLoadingProductContent={setIsLoadingProductContent}
                />
                <DashboardProductMinStock productsMinStock={productsMinStock} />
              </div>
            </>
          )}
        </div>
      </section>
    );
  }
};

export default Dashboard;
