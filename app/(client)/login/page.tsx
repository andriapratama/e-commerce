import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import LoginForm from "@/components/client/login/LoginForm";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Login = async () => {
  const { categories } = await useGetAllCategoriesHook();

  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    redirect("/");
  }

  return (
    <section className="w-full">
      <Navbar categories={categories} />
      <LoginForm />

      <div className="fixed bottom-0 left-0 right-0">
        <Footer />
      </div>
    </section>
  );
};

export default Login;
