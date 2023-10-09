import OrderTable from "@/components/admin/order/OrderTable";
import Title from "@/components/admin/Title";
import React from "react";

const Orders = () => {
  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <Title title="Orders" />
        <OrderTable />
      </div>
    </section>
  );
};

export default Orders;
