import React from "react";

interface OrderDetailCardProps {
  children: React.ReactNode;
  title: string;
}

const OrderDetailCard: React.FC<OrderDetailCardProps> = ({
  children,
  title,
}) => {
  return (
    <div className="w-full border border-slate-300 rounded-md bg-white">
      <div className="flex justify-center items-center bg-gray-200 w-full h-10">
        <span className="font-medium md:text-sm capitalize text-gray-800">
          {title}:
        </span>
      </div>
      <div className="p-5 leading-7 text-gray-600">{children}</div>
    </div>
  );
};

export default OrderDetailCard;
