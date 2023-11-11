import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import RegisterForm from "@/components/client/register/RegisterForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Register = async () => {
  try {
    const session = await getServerSession(authOptions);

    return (
      <section className="w-full">
        <Topbar role={session?.user.role} />
        <Navbar />
        <TitlePage title="Register" />
        <RegisterForm />
        <Footer />
      </section>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Register;
