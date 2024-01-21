import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import RegisterForm from "@/components/client/register/RegisterForm";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Register = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    redirect("/");
  }

  const { categories } = await useGetAllCategoriesHook();

  return (
    <section className="w-full">
      <Navbar categories={categories} />
      <RegisterForm />
      <Footer />
    </section>
  );
};

export default Register;
