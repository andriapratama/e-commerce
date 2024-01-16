import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar/Navbar";
import ProfileContent from "@/components/client/profile/ProfileContent";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetAllCategoriesHook } from "@/hooks/client/CategoriesHook";
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

    const { categories } = await useGetAllCategoriesHook();

    return (
      <section className="w-full min-h-[calc(100vh-150px)]">
        <Navbar
          countCarts={countCarts}
          categories={categories}
          role={session?.user.role}
        />
        <ProfileContent user={user} />
        <Footer />
      </section>
    );
  } catch (error) {
    return redirect("/login");
  }
};

export default Profil;
