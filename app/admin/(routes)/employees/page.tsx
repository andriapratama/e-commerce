import Title from "@/components/admin/Title";
import EmployeeContent from "@/components/admin/employee/EmployeeContent";
import { authOptions } from "@/lib/auth";
import { EmployeeType } from "@/types/admin/EmployeeType";
import axios from "axios";
import { getServerSession } from "next-auth";
import React from "react";
import { ToastContainer } from "react-toastify";

const Employees = async () => {
  try {
    const session = await getServerSession(authOptions);

    const username = session?.user.username;

    const resEmployees = await axios.get(
      `${process.env.WEB_URL}/api/${username}/employees/get`
    );

    const employees: EmployeeType[] = resEmployees.data.data;

    return (
      <section className="admin__container">
        <div className="admin__container-body">
          <ToastContainer />

          <Title title="Pegawai" />

          <EmployeeContent username={username} employees={employees} />
        </div>
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Employees;
