import React from "react";
import { ConvertIDR } from "@/utils/ConvertIDR";

interface OrderDetailInfoProps {
  name: string;
  value?: number | null;
  statusPayment?: string;
}

const OrderDetailInfo: React.FC<OrderDetailInfoProps> = ({
  name,
  value,
  statusPayment,
}) => {
  return (
    <div className="w-full flex justify-end mb-3">
      <span className="font-semibold text-gray-800 text-right">{name}</span>
      <span className="text-gray-500 text-right w-[280px]">
        {value === 0 ? "Rp. 0" : value ? ConvertIDR(value) : null}
        {statusPayment === "pending"
          ? "Belum dibayar"
          : statusPayment === "paid"
          ? "Lunas"
          : null}
      </span>
    </div>
  );
};

export default OrderDetailInfo;
