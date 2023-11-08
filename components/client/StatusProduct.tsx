import React from "react";

const StatusProduct = ({ status }: { status: string }) => {
  return (
    <React.Fragment>
      {status === "sale" || status === "best" || status === "new" ? (
        <div
          className={`absolute text-sm px-3 py-[2px] font-serif capitalize top-0 left-2 rounded text-white ${
            status === "sale"
              ? "bg-red-500"
              : status === "new"
              ? "bg-blue-500"
              : status === "best"
              ? "bg-yellow-600"
              : ""
          }`}
        >
          {status === "best" ? "Best Seller" : status}
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default StatusProduct;
