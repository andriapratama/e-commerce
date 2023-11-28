"use client";

import Title from "@/components/admin/Title";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import ProductDetailData from "@/components/admin/product-detail/ProductDetailData";
import ProductDetailFinanceLog from "@/components/admin/product-detail/ProductDetailFinanceLog";
import ProductDetailStockLog from "@/components/admin/product-detail/ProductDetailStockLog";
import ProductDetailStatusLog from "@/components/admin/product-detail/ProductDetailStatusLog";
import ProductEditButton from "@/components/admin/product-edit/ProductEditButton";
import { useParams, useRouter } from "next/navigation";
import { AdminProductType } from "@/types/ProductType";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import ContentLoading from "@/components/ContentLoading";

interface FinanceLogType {
  cost: number;
  createdAt: string;
  employee: { name: string };
  note: string;
  price: number;
}

interface StatusLogType {
  createdAt: string;
  employee: { name: string };
  note: string;
  salePrice: number;
  status: "new" | "active" | "sale" | "best" | "archive";
}

interface StockLogType {
  createdAt: string;
  employee: { name: string };
  note: string;
  previousStock: number;
  status: "first" | "update" | "decrease" | "increase";
  stock: number;
  stockNow: number;
}

const ProductDetail = () => {
  const [product, setProduct] = useState<AdminProductType>({
    name: "",
    slug: "",
    totalStock: 0,
    minimumStock: 0,
    price: 0,
    cost: 0,
    netFill: 0,
    status: "active",
    linkGojek: "",
    description: "",
    salePrice: 0,
    category: { name: "" },
    image: "",
    createdAt: "",
  });
  const [financeList, setFinanceList] = useState<FinanceLogType[]>([]);
  const [statusList, setStatusList] = useState<StatusLogType[]>([]);
  const [stockList, setStockList] = useState<StockLogType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const router = useRouter();

  const params = useParams();

  const slug = params.id;

  const api = `/api/admin/products/${slug}`;

  const getProduct = useCallback(async () => {
    try {
      const res = await axios.get(api + "/data/get");

      setProduct(res.data.data);

      getFinanceLog();
      getStatusLog();
      getStockLog();

      setIsLoadingContent(false);
    } catch (error: any) {
      if (error.response.status === 404) {
        router.push("/404");
      } else {
        toast.error(error.response.data.message);
        setIsLoadingContent(false);
      }
    }
  }, []);

  const getFinanceLog = useCallback(async () => {
    try {
      const res = await axios.get(api + "/finance/get");

      setFinanceList(res.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  const getStatusLog = useCallback(async () => {
    try {
      const res = await axios.get(api + "/status/get");

      setStatusList(res.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  const getStockLog = useCallback(async () => {
    try {
      const res = await axios.get(api + "/stock/get");

      setStockList(res.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const { categories } = useGetCategoriesHook();

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />
        <Title title="Detail Produk" />

        {isLoadingContent ? (
          <ContentLoading className="mt-10" />
        ) : (
          <React.Fragment>
            <div className="w-full flex justify-center mb-5">
              <div className="lg:flex block w-full gap-3">
                <div className="w-full flex justify-center items-start">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="object-cover lg:h-[650px] md:h-[500px] h-[400px] w-auto mb-3 rounded-md"
                    priority
                  />
                </div>

                <div className="w-full bg-white border rounded-md shadow-md p-5 h-max">
                  <div className="w-full flex justify-end mb-3">
                    <ProductEditButton
                      product={product}
                      categories={categories}
                      paramsSlug={product.slug}
                      getProduct={getProduct}
                      getFinanceLog={getFinanceLog}
                      getStatusLog={getStatusLog}
                      getStockLog={getStockLog}
                    />
                  </div>

                  <ProductDetailData product={product} />
                </div>
              </div>
            </div>
            <div className="lg:flex block gap-3">
              <ProductDetailFinanceLog financeList={financeList} />
              <ProductDetailStatusLog statusList={statusList} />
            </div>
            <div className="flex justify-center">
              <div className="lg:w-[80%] w-full">
                <ProductDetailStockLog stockList={stockList} />
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default ProductDetail;
