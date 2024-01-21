import { PromoType } from "@/types/PromoType";
import axios from "axios";

export const useGetAllPromoHook = async () => {
  const res = await axios.get(`${process.env.WEB_URL}/api/promo/get`);

  const promos: PromoType[] = res.data.data;

  return { promos };
};

export const useGetOnePromoHook = async (slug: string) => {
  const res = await axios.get(`${process.env.WEB_URL}/api/promo/${slug}/get`);

  const promo: PromoType = res.data.data;

  return { promo };
};

export const useGetPromoStockHook = async (slug: string) => {
  const res = await axios.get(
    `${process.env.WEB_URL}/api/promo/${slug}/stock/get`
  );

  const totalStock = res.data.data;

  return { totalStock };
};
