"use client";

import Title from "@/components/admin/Title";
import EmployeeAdd from "@/components/admin/employee/EmployeeAdd";
import EmployeeTable from "@/components/admin/employee/EmployeeTable";
import { EmployeeDataType } from "@/types/admin/Employees";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeDataType[]>([]);

  const showEmployees = async () => {
    try {
      const res = await axios.get("/api/admin/employees");
      setEmployees(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showEmployees();
  }, []);
  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />

        <Title title="Pegawai" />

        <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
          <EmployeeAdd ShowEmployees={showEmployees} />
          <EmployeeTable employees={employees} />
        </div>
      </div>
    </section>
  );
};

export default Employees;
