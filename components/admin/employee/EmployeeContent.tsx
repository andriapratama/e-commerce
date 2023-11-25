"use client";

import React, { useState } from "react";
import EmployeeEdit from "./EmployeeEdit";
import EmployeeAdd from "./EmployeeAdd";
import EmployeeTable from "./EmployeeTable";
import { EmployeeType } from "@/types/admin/EmployeeType";

interface EmployeeContentProps {
  username: string | undefined;
  employees: EmployeeType[];
}

const EmployeeContent: React.FC<EmployeeContentProps> = ({
  username,
  employees,
}) => {
  const [editEmployee, setEditEmployee] = useState({
    name: "",
    username: "",
    role: "",
  });
  return (
    <div className="flex justify-between md:flex-nowrap flex-wrap gap-3 w-full">
      {editEmployee.name ? (
        <EmployeeEdit
          paramsUsername={username}
          editEmployee={editEmployee}
          setEditEmployee={setEditEmployee}
        />
      ) : (
        <EmployeeAdd paramsUsername={username} />
      )}
      <EmployeeTable employees={employees} setEditEmployee={setEditEmployee} />
    </div>
  );
};

export default EmployeeContent;
