"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useSWR, { Fetcher } from "swr";

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
  const { isLoadingPage, setIsLoadingPage } = useLoadingPageContext();

  const [editEmployee, setEditEmployee] = useState({
    name: "",
    username: "",
    role: "",
  });

  const fetcher: Fetcher<{
    data: EmployeeType[] | undefined;
    message: string;
  }> = (url: string) => axios.get(url).then((res) => res.data);

  const { data, isLoading } = useSWR("/api/admin/employees/get", fetcher);

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
                editEmployee={editEmployee}
                setEditEmployee={setEditEmployee}
              />
            ) : (
              <EmployeeAdd />
            )}

            {isLoading ? (
              <ContentLoading />
            ) : (
              <EmployeeTable
                employees={data?.data}
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
