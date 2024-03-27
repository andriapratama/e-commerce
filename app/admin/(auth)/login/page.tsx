import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { authOptions } from "@/lib/auth";

const LoginContent = dynamic(
  () => import("@/components/admin/login/LoginContent")
);

const AdminLogin = async () => {
  let isAutehncticated = false;
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role === "superAdmin" || session?.user.role === "admin") {
      isAutehncticated = true;
    }

    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoginContent />
      </div>
    );
  } catch (error) {
  } finally {
    if (isAutehncticated === true) redirect("/admin/orders");
  }
};

export default AdminLogin;
