import axios from "axios";
import { useParams } from "next/navigation";
import useSWR, { Fetcher } from "swr";

import { OrderLogType, OrderType } from "@/types/admin/OrderType";

interface Order extends OrderType {
  orderLog: OrderLogType[];
}

export const useGetOrderHook = () => {
  const params: { id: string } = useParams();

  const invoice: string = params.id;

  const fetcher: Fetcher<{
    data: Order | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR(
    `/api/admin/orders/${invoice}/order-detail/get`,
    fetcher
  );

  return {
    invoice,
    order: data?.data,
    isLoadingContent: isLoading,
  };
};
