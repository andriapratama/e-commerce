"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Title from "@/components/admin/Title";
import EmployeeAdd from "@/components/admin/employee/EmployeeAdd";
import EmployeeEdit from "@/components/admin/employee/EmployeeEdit";
import EmployeeTable from "@/components/admin/employee/EmployeeTable";
import ContentLoading from "@/components/ContentLoading";
import { EmployeeType } from "@/types/admin/EmployeeType";

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const [editEmployee, setEditEmployee] = useState({
    name: "",
    username: "",
    role: "",
  });

  const getEmployees = async () => {
    try {
      const res = await axios.get(`/api/admin/employees/get`);

      setEmployees(res.data.data);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <section className="admin__container">
      <div className="admin__container-body">
        <ToastContainer />

        <Title title="Pegawai" />

        <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
          {editEmployee.name ? (
            <EmployeeEdit
              getEmployees={getEmployees}
              editEmployee={editEmployee}
              setEditEmployee={setEditEmployee}
            />
          ) : (
            <EmployeeAdd getEmployees={getEmployees} />
          )}

          {isLoadingContent ? (
            <ContentLoading />
          ) : (
            <EmployeeTable
              employees={employees}
              setEditEmployee={setEditEmployee}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Employees;
