import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { UserType } from "@/types/UserType";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const ProfileContent = dynamic(
  () => import("@/components/client/profile/ProfileContent")
);

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Manage your profile effortlessly. Personalize your experience and stay updated.";

  const title = "Profile | Bottle Time";

  return {
    title: title,
    description: desc,
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/profile`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: ["/logo.png"],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Profil = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    let thisUser: UserType = {
      firstName: "",
      lastName: "",
      email: "",
      role: "guest",
      address: null,
      phone: null,
      active: false,
    };

    let thisCountCarts: number = 0;

    let user404: boolean = false;

    try {
      const { user } = await useGetUserByEmailHook();

      thisUser = user;
    } catch (error: any) {
      if (error.response.status === 404) user404 = true;
    } finally {
      if (user404) {
        redirect("/denied");
      }
    }

    let isCountCarts404: boolean = false;

    try {
      const { countCarts } = await useCountCartsHook();

      thisCountCarts = countCarts;
    } catch (error: any) {
      if (error.response.status === 404) isCountCarts404 = true;
    } finally {
      if (isCountCarts404) redirect("/denied");
    }

    return (
      <section className="w-full">
        <Navbar countCarts={thisCountCarts} role={session?.user.role} />
        <ProfileContent user={thisUser} />
        <Footer />
      </section>
    );
  } else {
    redirect("/login");
  }
};

export default Profil;
