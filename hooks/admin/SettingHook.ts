import axios from "axios";
import useSWR, { Fetcher } from "swr";

import { SettingType } from "@/types/admin/SettingType";

export const useGetSettingHook = () => {
  const fetcher: Fetcher<{
    data: SettingType | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR("/api/admin/setting/get", fetcher);

  return {
    setting: data?.data,
    isLoadingContent: isLoading,
  };
};
