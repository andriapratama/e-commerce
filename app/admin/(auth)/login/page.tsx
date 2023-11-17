import React from "react";
import LoginContent from "@/components/admin/login/LoginContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const AdminLogin = async () => {
  let isSuccess = false;
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role === "superAdmin" || session?.user.role === "admin") {
      isSuccess = true;
    }

    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoginContent />
      </div>
    );
  } catch (error) {
    console.log(error);
  } finally {
    if (isSuccess === true) redirect("/admin/orders");
  }
};

export default AdminLogin;
