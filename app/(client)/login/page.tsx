import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import LoginForm from "@/components/client/login/LoginForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Login = async () => {
  try {
    const session = await getServerSession(authOptions);

    return (
      <section className="w-full">
        <Topbar session={session} />
        <Navbar />
        <TitlePage title="Login" />
        <LoginForm />
        <Footer />
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Login;
