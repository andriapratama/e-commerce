"use client";

import axios from "axios";
import Image from "next/image";
import Title from "@/components/admin/Title";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { AdminProductType } from "@/types/ProductType";
import ContentLoading from "@/components/ContentLoading";
import { StockLogType } from "@/types/admin/StockLogType";
import { StatusLogType } from "@/types/admin/StatusLogType";
import { FinanceLogType } from "@/types/admin/FianceLogType";
import React, { useCallback, useEffect, useState } from "react";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { useGetSubCategoryHook } from "@/hooks/admin/GetSubCategoryHook";
import ProductEditButton from "@/components/admin/product-edit/ProductEditButton";
import ProductDetailData from "@/components/admin/product-detail/ProductDetailData";
import ProductDetailFinanceLog from "@/components/admin/product-detail/ProductDetailFinanceLog";
import ProductDetailStockLog from "@/components/admin/product-detail/ProductDetailStockLog";
import ProductDetailStatusLog from "@/components/admin/product-detail/ProductDetailStatusLog";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import PageLoading from "@/components/PageLoading";

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
    subCategory: null,
    image: "",
    createdAt: "",
  });

  const [financeList, setFinanceList] = useState<FinanceLogType[]>([]);
  const [statusList, setStatusList] = useState<StatusLogType[]>([]);
  const [stockList, setStockList] = useState<StockLogType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

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

  const { subCategories } = useGetSubCategoryHook();

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
                        subCategories={subCategories}
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
              <div className="flex justify-center">
                <div className="lg:w-[80%] w-full">
                  <ProductDetailFinanceLog financeList={financeList} />
                  <ProductDetailStatusLog statusList={statusList} />
                  <ProductDetailStockLog stockList={stockList} />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </section>
    );
  }
};

export default ProductDetail;
