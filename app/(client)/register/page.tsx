import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import RegisterForm from "@/components/client/register/RegisterForm";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { authOptions } from "@/lib/auth";
import axios from "axios";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Register = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    redirect("/");
  }

  const { categories } = await useGetAllCategoriesHook();

  const setting = await axios.get(`${process.env.WEB_URL}/api/setting/get`);

  const settingValue = setting.data.data;

  return (
    <section className="w-full">
      <Navbar categories={categories} />
      <RegisterForm />
      <Footer settingValue={settingValue} />
    </section>
  );
};

export default Register;
