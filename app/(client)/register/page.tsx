import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { authOptions } from "@/lib/auth";

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
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/register`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
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
    <React.Fragment>
      <RegisterForm />
    </React.Fragment>
  );
};

export default Register;
