import axios from "axios";

import { SettingType } from "@/types/SettingType";

export const getSetting = async () => {
  try {
    const res = await axios.get<{ message: string; data: SettingType }>(
      `${process.env.WEB_URL}/api/setting/get`
    );

    const setting: SettingType = res.data.data;

    return setting;
  } catch (error) {
    console.log(error);
  }
};
