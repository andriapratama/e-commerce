"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import ContentLoading from "@/components/ContentLoading";
import PageLoading from "@/components/PageLoading";
import { useLoadingPageContext } from "@/context/LoadingPageContext";
import { EmployeeType } from "@/types/admin/EmployeeType";

const Title = dynamic(() => import("@/components/admin/Title"));
const EmployeeTable = dynamic(
  () => import("@/components/admin/employee/EmployeeTable")
);
const EmployeeAdd = dynamic(
  () => import("@/components/admin/employee/EmployeeAdd")
);
const EmployeeEdit = dynamic(
  () => import("@/components/admin/employee/EmployeeEdit")
);

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);

  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [editEmployee, setEditEmployee] = useState({
    name: "",
    username: "",
    role: "",
  });

  const getEmployees = useCallback(async () => {
    try {
      const res = await axios.get(`/api/admin/employees/get`);

      setEmployees(res.data.data);

      setIsLoadingContent(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return <PageLoading />;
  } else {
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
  }
};

export default Employees;
