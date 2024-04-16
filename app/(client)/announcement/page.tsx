import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";

const AnnouncementContent = dynamic(
  () => import("@/components/client/announcement/AnnouncementContent")
);

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Your cart: where great tastes meet convenience. Shop now for a delightful experience.";

  const title = "Announcement | Bottle Time";

  return {
    title: title,
    description: desc,
    metadataBase: new URL(`${process.env.WEB_URL}`),
    openGraph: {
      type: "website",
      url: `${process.env.WEB_URL}/announcement`,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: [`/logo.png`],
    },
  };
}

const Announcement = async () => {
  const session = await getServerSession(authOptions);

  let isUserActive: boolean = false;

  if (session?.user.role === "member") {
    let user404: boolean = false;

    try {
      const { user } = await useGetUserByEmailHook();

      isUserActive = user.active;
    } catch (error: any) {
      if (error.response.status === 404) user404 = true;
    } finally {
      if (session.user.role === "member" && isUserActive) {
        return redirect("/");
      }

      if (user404) redirect("/denied");
    }
  }

  return (
    <React.Fragment>
      {session?.user.role === "member" ? (
        <AnnouncementContent active={isUserActive} />
      ) : (
        <AnnouncementContent />
      )}
    </React.Fragment>
  );
};

export default Announcement;
