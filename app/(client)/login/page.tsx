import axios from "axios";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { authOptions } from "@/lib/auth";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const LoginForm = dynamic(() => import("@/components/client/login/LoginForm"));

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    redirect("/");
  }

  const setting = await axios.get(`${process.env.WEB_URL}/api/setting/get`);

  const settingValue = setting.data.data;

  return (
    <section className="w-full">
      <Navbar />
      <LoginForm />

      <Footer settingValue={settingValue} />
    </section>
  );
};

export default Login;
