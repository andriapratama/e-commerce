import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { authOptions } from "@/lib/auth";

const LoginForm = dynamic(() => import("@/components/client/login/LoginForm"));

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Welcome back! Login to access your account and enjoy personalized perks. Let's get started.";

  const title = "Login | Bottle Time";

  return {
    title: title,
    description: desc,
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/login`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
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
    <React.Fragment>
      <LoginForm />
    </React.Fragment>
  );
};

export default Login;
