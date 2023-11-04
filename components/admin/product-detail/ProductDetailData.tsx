"use client";

import { ProductType } from "@/types/ProductType";
import { ConvertIDR } from "@/utils/ConvertIDR";
import React from "react";

interface ProductDetailDataProps {
  product: ProductType;
}

const ProductDetailData: React.FC<ProductDetailDataProps> = ({ product }) => {
  return (
    <React.Fragment>
      <div className="admin-product-detail__group mb-3">
        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Nama</div>
          <div className="admin-product-detail__value capitalize">
            {product.name}
          </div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Slug</div>
          <div className="admin-product-detail__value">{product.slug}</div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Stok Total</div>
          <div className="admin-product-detail__value">
            {product.totalStock}
          </div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Stok Minimal</div>
          <div className="admin-product-detail__value">
            {product.minimumStock}
          </div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Harga Jual</div>
          <div className="admin-product-detail__value">
            {ConvertIDR(product.price)}
          </div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Harga Pokok</div>
          <div className="admin-product-detail__value">
            {ConvertIDR(product.cost)}
          </div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Kategori</div>
          <div className="admin-product-detail__value capitalize">
            {product.category.name}
          </div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Status</div>
          <div className="admin-product-detail__value capitalize">
            {product.status === "new"
              ? "baru"
              : product.status === "active"
              ? "aktif"
              : product.status === "best"
              ? "best seller"
              : product.status === "sale"
              ? "sale"
              : "arsip"}
          </div>
        </div>

        <div className="admin-product-detail__content">
          <div className="admin-product-detail__title">Isi Bersih</div>
          <div className="admin-product-detail__value">{product.netFill}ml</div>
        </div>

        {product.status === "sale" ? (
          <div className="admin-product-detail__content">
            <div className="admin-product-detail__title">Harga Sale</div>
            <div className="admin-product-detail__value">
              {ConvertIDR(product.salePrice)}
            </div>
          </div>
        ) : null}

        {product.linkGojek ? (
          <div className="admin-product-detail__content xl:!w-full md:!w-full">
            <div className="admin-product-detail__title">Link Gojek</div>
            <div className="admin-product-detail__value">
              {product.linkGojek}
            </div>
          </div>
        ) : null}

        <div className="admin-product-detail__content xl:!w-full md:!w-full">
          <div className="admin-product-detail__title">Deskripsi</div>
          <div className="admin-product-detail__value">
            {product.description}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductDetailData;
