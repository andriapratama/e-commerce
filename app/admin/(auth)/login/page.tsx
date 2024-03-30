import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { authOptions } from "@/lib/auth";

const LoginContent = dynamic(
  () => import("@/components/admin/login/LoginContent")
);

export async function generateMetadata(): Promise<Metadata> {
  let logo: string = "";

  try {
    const res = await axios.get(`${process.env.WEB_URL}/api/setting/logo/get`);

    logo = res.data.data.image;
  } catch (error) {}

  const desc =
    "Login ke dashboard admin kami. Kelola situs dengan mudah dari satu titik.";

  const title = "Login";

  return {
    title: title,
    description: desc,
    icons: {
      icon: logo,
    },
    openGraph: {
      type: "website",
      url: process.env.WEB_URL,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [logo],
    },
  };
}

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
