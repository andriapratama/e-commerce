import AnnouncementContent from "@/components/client/announcement/AnnouncementContent";
import Navbar from "@/components/client/Navbar/Navbar";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { UserType } from "@/types/UserType";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Announcement = async () => {
  const { categories } = await useGetAllCategoriesHook();

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
      <Navbar categories={categories} />

      {session?.user.role === "member" ? (
        <AnnouncementContent active={thisUser.active} />
      ) : (
        <AnnouncementContent />
      )}
    </section>
  );
};

export default Announcement;
