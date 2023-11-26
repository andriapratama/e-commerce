import React from "react";

interface StatusProductProps {
  status: "new" | "active" | "best" | "sale" | "archive";
}

const StatusProduct: React.FC<StatusProductProps> = ({ status }) => {
  return (
    <div
      className={`px-4 py-3 font-medium rounded-full ${
        status === "new"
          ? "bg-black text-white"
          : status === "active"
          ? "bg-white border border-black text-black"
          : status === "best"
          ? "bg-green-200 text-green-700"
          : status === "sale"
          ? "bg-red-200 text-red-700"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {status === "new"
        ? "Baru"
        : status === "active"
        ? "Aktif"
        : status === "best"
        ? "Best Seller"
        : status === "sale"
        ? "Sale"
        : "Arsip"}
    </div>
  );
};

export default StatusProduct;
