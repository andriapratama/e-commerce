import Title from "@/components/admin/Title";
import React from "react";
import Image from "next/image";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import ProductDetailData from "@/components/admin/product-detail/ProductDetailData";
import ProductDetailFinanceLog from "@/components/admin/product-detail/ProductDetailFinanceLog";
import ProductDetailStockLog from "@/components/admin/product-detail/ProductDetailStockLog";
import ProductDetailStatusLog from "@/components/admin/product-detail/ProductDetailStatusLog";
import ProductEditButton from "@/components/admin/product-edit/ProductEditButton";
import { redirect } from "next/navigation";

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  try {
    const session = await getServerSession(authOptions);

    const username = session?.user.username;

    const slug = params.id;

    const api = `${process.env.WEB_URL}/api/${username}/products/${slug}`;

    const productRes = await axios.get(api + "/data/get");

    const product = productRes.data.data;

    const financeLog = await axios.get(api + "/finance/get");

    const financeList = financeLog.data.data;

    const stockLog = await axios.get(api + "/stock/get");

    const stockList = stockLog.data.data;

    const statusLog = await axios.get(api + "/status/get");

    const statusList = statusLog.data.data;

    const categoryRes = await axios.get(
      `${process.env.WEB_URL}/api/${username}/categories/get`
    );

    const categories = categoryRes.data.data;

    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />
          <Title title="Detail Produk" />

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
                    paramsSlug={params.id}
                    username={username}
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
        </div>
      </section>
    );
  } catch (error: any) {
    if (error.response.status === 404) redirect("/404");
  }
};

export default ProductDetail;
