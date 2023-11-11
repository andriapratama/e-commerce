import AnnouncementPage from "@/components/client/announcement/Announcement";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const Announcement = async () => {
  try {
    const session = await getServerSession(authOptions);

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
  }
};

export default Announcement;
