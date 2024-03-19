import axios from "axios";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";

import { useCountCartsHook } from "@/hooks/client/CartHook";
import { authOptions } from "@/lib/auth";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const PromoContent = dynamic(
  () => import("@/components/client/promo/PromoContent")
);

const Promos = async () => {
  let thisCountCarts: number = 0;

  const session = await getServerSession(authOptions);

  if (session?.user.role === "member") {
    let isCountCarts404: boolean = false;

    try {
      const { countCarts } = await useCountCartsHook();

      thisCountCarts = countCarts;
    } catch (error: any) {
      if (error.response.status === 404) isCountCarts404 = true;
    } finally {
      if (isCountCarts404) redirect("/denied");
    }
  }

  const setting = await axios.get(`${process.env.WEB_URL}/api/setting/get`);

  const settingValue = setting.data.data;

  return (
    <section className="!w-full overflow-hidden">
      {session?.user.role === "member" ? (
        <Navbar countCarts={thisCountCarts} role={session?.user.role} />
      ) : (
        <Navbar />
      )}
      <PromoContent />
      <Footer settingValue={settingValue} />
    </section>
  );
};

export default Promos;
