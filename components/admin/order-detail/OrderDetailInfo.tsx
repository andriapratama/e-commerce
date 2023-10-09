import { ConvertIDR } from "@/utils/ConvertIDR";
import React from "react";

interface OrderDetailInfoProps {
  name: string;
  value?: number;
  status?: string;
}

const OrderDetailInfo: React.FC<OrderDetailInfoProps> = ({
  name,
  value,
  status,
}) => {
  return (
    <div className="w-full flex justify-end mb-3">
      <span className="font-semibold text-gray-800 text-right">{name}</span>
      <span className="text-gray-500 text-right w-[280px]">
        {value === 0 ? "Rp. 0,00" : value ? ConvertIDR(value) : null}
        {status ? status : null}
      </span>
    </div>
  );
};

export default OrderDetailInfo;
