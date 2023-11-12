import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import LoginForm from "@/components/client/login/LoginForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Login = async () => {
  let isSuccess = false;
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      isSuccess = true;
    }

    return (
      <section className="w-full">
        <Topbar role={session?.user.role} />
        <Navbar />
        <TitlePage title="Login" />
        <LoginForm />
        <Footer />
      </section>
    );
  } catch (error) {
    console.log(error);
  } finally {
    if (isSuccess === true) {
      redirect("/");
    }
  }
};

export default Login;
