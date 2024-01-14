import { PromoType } from "@/types/PromoType";
import axios from "axios";

export const useGetAllPromoHook = async () => {
  const res = await axios.get(`${process.env.WEB_URL}/api/promo/get`);

  const promos: PromoType[] = res.data.data;

  return { promos };
};
