import React from "react";

const StatusOrder = (status: "new" | "ongoing" | "done" | "cancel") => {
  return (
    <div
      className={`px-10 py-3 rounded-full ${
        status === "new"
          ? "bg-black text-white"
          : status === "ongoing"
          ? "bg-gray-300 text-black font-medium"
          : status === "done"
          ? "bg-white border border-black"
          : "bg-red-500 text-gray-100"
      }`}
    >
      {status === "new"
        ? "Baru"
        : status === "ongoing"
        ? "Diproses"
        : status === "done"
        ? "Selesai"
        : "Batal"}
    </div>
  );
};

export default StatusOrder;
