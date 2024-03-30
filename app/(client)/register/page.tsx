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
const RegisterForm = dynamic(
  () => import("@/components/client/register/RegisterForm")
);

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Join us now! Register for exclusive perks and seamless shopping experience.";

  const title = "Register | Bottle Time";

  return {
    title: title,
    description: desc,
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/register`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: ["/logo.png"],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Register = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    redirect("/");
  }

  return (
    <section className="w-full">
      <Navbar />
      <RegisterForm />
      <Footer />
    </section>
  );
};

export default Register;
