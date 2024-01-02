"use client";

import { PromoProductType, PromoType } from "@/types/PromoType";
import { ConvertDateId } from "@/utils/ConvertDateId";
import { ConvertIDR } from "@/utils/ConvertIDR";
import Image from "next/image";
import React from "react";
import PromoDetailProductsTable from "./PromoDetailProductsTable";
import PromoEditButton from "../promo-edit/PromoEditButton";

interface Props {
  getPromo: () => void;
  promo: PromoType;
  provisions: PromoProductType[];
  bonus: PromoProductType[];
}

const PromoDetailContent: React.FC<Props> = ({
  getPromo,
  promo,
  provisions,
  bonus,
}) => {
  return (
    <React.Fragment>
      <div className="w-full mb-5 flex justify-center">
        <Image
          src={promo.image}
          alt={promo.name}
          width={600}
          height={400}
          className="object-contain lg:w-auto lg:h-[500px] w-full h-auto rounded-md"
          priority
        />
      </div>

      <div className="admin__card w-full h-max">
        <div className="w-full flex justify-end mb-5">
          <PromoEditButton getPromo={getPromo} promo={promo} />
        </div>

        <div className="admin-promo-detail__group">
          <div className="admin-promo-detail__content">
            <div className="admin-promo-detail__title">Nama Promo</div>
            <div className="admin-promo-detail__value capitalize">
              {promo.name}
            </div>
          </div>

          <div className="admin-promo-detail__content">
            <div className="admin-promo-detail__title">Slug Promo</div>
            <div className="admin-promo-detail__value">{promo.slug}</div>
          </div>

          <div className="admin-promo-detail__content">
            <div className="admin-promo-detail__title">Tanggal Dibuat</div>
            <div className="admin-promo-detail__value capitalize">
              {ConvertDateId(promo.createdAt)}
            </div>
          </div>

          <div className="admin-promo-detail__content">
            <div className="admin-promo-detail__title">Harga Normal</div>
            <div className="admin-promo-detail__value">
              {ConvertIDR(promo.firstPrice)}
            </div>
          </div>

          <div className="admin-promo-detail__content">
            <div className="admin-promo-detail__title">Harga Promo</div>
            <div className="admin-promo-detail__value">
              {ConvertIDR(promo.promoPrice)}
            </div>
          </div>

          <div className="admin-promo-detail__content">
            <div className="admin-promo-detail__title">Status</div>
            <div className="admin-promo-detail__value capitalize">
              {promo.status === "active" ? "aktif" : "arsip"}
            </div>
          </div>
        </div>

        <div className="admin-promo-detail__content">
          <div className="admin-promo-detail__title">Deskripsi</div>
          <div className="admin-promo-detail__value capitalize">
            {promo.description}
          </div>
        </div>
      </div>

      <PromoDetailProductsTable title="Syarat Produk" products={provisions} />

      <PromoDetailProductsTable title="Bonus Produk" products={bonus} />
    </React.Fragment>
  );
};

export default PromoDetailContent;
