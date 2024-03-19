import axios from "axios";

import { PromoType } from "@/types/PromoType";

export const useGetOnePromoHook = async (slug: string) => {
  const res = await axios.get(`${process.env.WEB_URL}/api/promo/${slug}/get`);

  const promo: PromoType = res.data.data;

  return { promo };
};

export const useGetPromoStockHook = async (slug: string) => {
  const res = await axios.get(
    `${process.env.WEB_URL}/api/promo/${slug}/stock/get`
  );

  const totalStock: number = res.data.data;

  return { totalStock };
};
