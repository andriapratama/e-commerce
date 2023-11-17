import AnnouncementContent from "@/components/client/announcement/AnnouncementContent";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Announcement = async () => {
  let role: "member" | undefined = undefined;

  let isActive: boolean = true;

  try {
    const session = await getServerSession(authOptions);

    session?.user.role === "member" ? (role = "member") : (role = undefined);

    const { user } = await useGetUserByEmailHook();

    isActive = user.active;

    return (
      <section className="w-full min-h-screen realtive">
        <Topbar />
        <Navbar />
        <TitlePage title="Announcement" />
        <AnnouncementContent active={user.active} />
      </section>
    );
  } catch (error: any) {
    return (
      <section className="w-full min-h-screen realtive">
        <Topbar />
        <Navbar />
        <TitlePage title="Announcement" />
        <AnnouncementContent />
      </section>
    );
  } finally {
    if (role === "member" && isActive === true) redirect("/");
  }
};

export default Announcement;
