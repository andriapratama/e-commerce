import TableOrders from "@/components/admin/TableOrders";
import Title from "@/components/admin/Title";
import React from "react";

const Orders = () => {
  return (
    <section className="w-full xl:flex xl:justify-center">
      <div className="w-full px-3 md:px-5 xl:px-10 2xl:max-w-[1536px]">
        <Title title="Orders" />
        <TableOrders />
      </div>
    </section>
  );
};

export default Orders;
