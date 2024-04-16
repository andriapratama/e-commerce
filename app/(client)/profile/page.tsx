import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { keywords } from "@/constant/Keywords";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { UserType } from "@/types/UserType";

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
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/profile`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
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

    return (
      <React.Fragment>
        <ProfileContent user={thisUser} />
      </React.Fragment>
    );
  } else {
    redirect("/login");
  }
};

export default Profil;
