import axios from "axios";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { authOptions } from "@/lib/auth";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const RegisterForm = dynamic(
  () => import("@/components/client/register/RegisterForm")
);

const Register = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    redirect("/");
  }

  const setting = await axios.get(`${process.env.WEB_URL}/api/setting/get`);

  const settingValue = setting.data.data;

  return (
    <section className="w-full">
      <Navbar />
      <RegisterForm />
      <Footer settingValue={settingValue} />
    </section>
  );
};

export default Register;
