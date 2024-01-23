import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import ProfileContent from "@/components/client/profile/ProfileContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";
import { UserType } from "@/types/UserType";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Profil = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    const { categories } = await useGetAllCategoriesHook();

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
      <section className="w-full min-h-[calc(100vh-150px)]">
        <Navbar
          countCarts={thisCountCarts}
          categories={categories}
          role={session?.user.role}
        />
        <ProfileContent user={thisUser} />
        <Footer />
      </section>
    );
  } else {
    redirect("/login");
  }
};

export default Profil;
