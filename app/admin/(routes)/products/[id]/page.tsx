import Title from "@/components/admin/Title";
import React from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductDetailData from "@/components/admin/product-detail/ProductDetailData";
import ProductDetailFinanceLog from "@/components/admin/product-detail/ProductDetailFinanceLog";
import ProductDetailStockLog from "@/components/admin/product-detail/ProductDetailStockLog";
import ProductDetailSaleLog from "@/components/admin/product-detail/ProductDetailSaleLog";

const ProductDetail = async ({ params }: { params: { id: string } }) => {
  const api = `${process.env.WEB_URL}/api/admin/products/${params.id}`;

  const productRes = await axios.get(api);

  const product = productRes.data.data;

  const financeLog = await axios.get(api + "/finance");

  const financeList = financeLog.data.data;

  const stockLog = await axios.get(api + "/stock");

  const stockList = stockLog.data.data;

  const saleLog = await axios.get(api + "/sale");

  const saleList = saleLog.data.data;

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <Title title="Detail Produk" />

        <div className="w-full flex justify-center mb-5">
          <div className="lg:w-[90%] lg:flex block w-full gap-5">
            <div className="w-full flex justify-center">
              <div className="lg:w-full sm:w-[400px] md:w-[450px] w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={900}
                  height={600}
                  className="object-contain mb-3 shadow-md rounded-md"
                  priority
                />
              </div>
            </div>

            <div className="w-full bg-white border rounded-md shadow-md p-5 h-max">
              <div className="w-full flex justify-end mb-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">Edit</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      Data Produk
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Harga Jual & Harga Pokok
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Total Stok
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Status Sale
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Ganti Gambar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <ProductDetailData product={product} />
            </div>
          </div>
        </div>
        <div className="lg:flex block gap-3">
          <ProductDetailFinanceLog financeList={financeList} />
          <ProductDetailStockLog stockList={stockList} />
        </div>
        <div className="lg:w-[49.5%] w-full">
          <ProductDetailSaleLog saleList={saleList} />
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
