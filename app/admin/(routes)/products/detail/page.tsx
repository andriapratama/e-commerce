"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { Fetcher } from "swr";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { useGetCategoriesHook } from "@/hooks/admin/CategoryHook";
import { useGetSubCategoryHook } from "@/hooks/admin/GetSubCategoryHook";
import { AdminProductType } from "@/types/ProductType";

const Title = dynamic(() => import("@/components/admin/Title"));
const ProductEditButton = dynamic(
  () => import("@/components/admin/product-edit/ProductEditButton")
);
const ProductDetailData = dynamic(
  () => import("@/components/admin/product-detail/ProductDetailData")
);
const ProductDetailFinanceLog = dynamic(
  () => import("@/components/admin/product-detail/ProductDetailFinanceLog")
);
const ProductDetailStockLog = dynamic(
  () => import("@/components/admin/product-detail/ProductDetailStockLog")
);
const ProductDetailStatusLog = dynamic(
  () => import("@/components/admin/product-detail/ProductDetailStatusLog")
);

const ProductDetail = () => {
  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const searchParams = useSearchParams();

  const slugParams = searchParams.get("slug");

  const fetcher: Fetcher<{
    data: AdminProductType | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(
    `/api/admin/products/${slugParams}/data/get`,
    fetcher
  );

  const { categories } = useGetCategoriesHook();

  const { subCategories } = useGetSubCategoryHook();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (!data?.data) {
    return null;
  }

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />
          <Title title="Detail Produk" />

          {isLoading ? (
            <ContentLoading className="mt-10" />
          ) : (
            <React.Fragment>
              <div className="w-full flex justify-center mb-5">
                <div className="lg:flex block w-full gap-3">
                  <div className="w-full flex justify-center items-start">
                    <Image
                      src={data.data.image}
                      alt={data.data.name}
                      width={400}
                      height={600}
                      className="object-cover lg:h-[650px] md:h-[500px] h-[400px] w-auto mb-3 rounded-md"
                      priority
                    />
                  </div>

                  <div className="w-full bg-white border rounded-md shadow-md p-5 h-max">
                    <div className="w-full flex justify-end mb-3">
                      <ProductEditButton
                        product={data.data}
                        categories={categories}
                        subCategories={subCategories}
                      />
                    </div>

                    <ProductDetailData product={data.data} />
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="lg:w-[80%] w-full">
                  <ProductDetailFinanceLog />
                  <ProductDetailStatusLog />
                  <ProductDetailStockLog />
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
