import axios from "axios";

import { HeroClientType } from "@/types/HeroType";

export const useGetAllHerosData = async () => {
  const res = await axios.get(`${process.env.WEB_URL}/api/hero/get`);

  const heros: HeroClientType[] = res.data.data;

  return { heros };
};
