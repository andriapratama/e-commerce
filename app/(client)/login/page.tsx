import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { authOptions } from "@/lib/auth";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const LoginForm = dynamic(() => import("@/components/client/login/LoginForm"));

export async function generateMetadata(): Promise<Metadata> {
  let logo: string = "";

  try {
    const res = await axios.get(`${process.env.WEB_URL}/api/setting/logo/get`);

    logo = res.data.data.image;
  } catch (error) {}

  const desc =
    "Welcome back! Login to access your account and enjoy personalized perks. Let's get started.";

  const title = "Login | Bottle Time";

  return {
    title: title,
    description: desc,
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/login`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [logo],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    redirect("/");
  }

  return (
    <section className="w-full">
      <Navbar />
      <LoginForm />

      <Footer />
    </section>
  );
};

export default Login;
