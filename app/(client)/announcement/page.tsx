import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { UserType } from "@/types/UserType";

const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const AnnouncementContent = dynamic(
  () => import("@/components/client/announcement/AnnouncementContent")
);

const Announcement = async () => {
  const session = await getServerSession(authOptions);

  let thisUser: UserType = {
    firstName: "",
    lastName: "",
    email: "",
    role: "guest",
    address: null,
    phone: null,
    active: false,
  };

  if (session?.user.role === "member") {
    let isUserActive: boolean = false;

    let user404: boolean = false;

    try {
      const { user } = await useGetUserByEmailHook();

      thisUser = user;

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
    <section className="w-full realtive">
      <Navbar />

      {session?.user.role === "member" ? (
        <AnnouncementContent active={thisUser.active} />
      ) : (
        <AnnouncementContent />
      )}
    </section>
  );
};

export default Announcement;
