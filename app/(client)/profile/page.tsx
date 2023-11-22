import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import TitlePage from "@/components/client/TitlePage";
import Topbar from "@/components/client/Topbar";
import ProfileContent from "@/components/client/profile/ProfileContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Profil = async () => {
  try {
    const session = await getServerSession(authOptions);

    const { user } = await useGetUserByEmailHook();

    const { countCarts } = await useCountCartsHook();

    return (
      <section className="w-full min-h-screen">
        <Topbar role={session?.user.role} userName={user.firstName} />
        <Navbar countCarts={countCarts} />
        <TitlePage title="My Profile" />
        <ProfileContent user={user} />
        <Footer />
      </section>
    );
  } catch (error) {
    return redirect("/login");
  }
};

export default Profil;
