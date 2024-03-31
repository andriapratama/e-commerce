import axios from "axios";

import { HeroClientType } from "@/types/HeroType";

export const useGetAllHerosData = async () => {
  const res = await axios.get(`${process.env.WEB_URL}/api/hero/get`);

  console.log(res);

  const heros: HeroClientType[] = res.data.data;

  return { heros };
};
