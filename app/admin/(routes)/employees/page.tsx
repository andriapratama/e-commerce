import Title from "@/components/admin/Title";
import EmployeeAdd from "@/components/admin/employee/EmployeeAdd";
import React from "react";
import { ToastContainer } from "react-toastify";

const Employees = () => {
  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />

        <Title title="Karyawan" />

        <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
          <EmployeeAdd />
        </div>
      </div>
    </section>
  );
};

export default Employees;
