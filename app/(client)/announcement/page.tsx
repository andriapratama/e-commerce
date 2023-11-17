import AnnouncementPage from "@/components/client/announcement/Announcement";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Announcement = async () => {
  let isSuccess = false;
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role === "member") isSuccess = true;

    return (
      <section className="w-full min-h-screen realtive">
        <Topbar role={session?.user.role} />
        <Navbar />
        <TitlePage title="Announcement" />
        <AnnouncementPage email={session?.user.email} />
      </section>
    );
  } catch (error: any) {
    console.log(error);
  } finally {
    if (isSuccess === true) redirect("/");
  }
};

export default Announcement;
