import { OrderLogType, OrderType } from "@/types/admin/OrderType";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useGetOrderHook = () => {
  const params: { id: string } = useParams();

  const invoice: string = params.id;

  const [order, setOrder] = useState<OrderType>({
    discount: null,
    employeeName: null,
    grandTotal: 0,
    invoice: "",
    note: "",
    paymentMethod: "cash",
    shipping: null,
    statusOrder: "new",
    statuspayment: "pending",
    subTotal: 0,
    tax: 0,
    totalItem: 0,
    user: {
      address: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
    orderDetail: [],
    createdAt: "",
  });

  const [orderLogs, setOrderLogs] = useState<OrderLogType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const getOrder = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/admin/orders/${invoice}/order-detail/get`
      );

      const order: OrderType = res.data.data;

      if (order.statusOrder === "new") {
        await axios.patch(`/api/admin/orders/${invoice}/status-order/patch`);
        getOrder();
      }

      setOrder(order);

      setOrderLogs(res.data.data.orderLog);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    getOrder();
  }, []);

  return {
    invoice,
    order,
    setOrder,
    isLoadingContent,
    setIsLoadingContent,
    getOrder,
    orderLogs,
    setOrderLogs,
  };
};
