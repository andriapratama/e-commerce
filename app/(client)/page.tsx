import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";
import { ToastContainer } from "react-toastify";

import { keywords } from "@/constant/Keywords";
import { useCountCartsHook } from "@/hooks/client/CartHook";
import { useGetUserByEmailHook } from "@/hooks/client/UserHook";
import { authOptions } from "@/lib/auth";

const Footer = dynamic(() => import("@/components/client/Footer"));
const Navbar = dynamic(() => import("@/components/client/Navbar/Navbar"));
const Hero = dynamic(() => import("@/components/client/home/Hero"));
const Products = dynamic(() => import("@/components/client/home/Products"));
const Promo = dynamic(() => import("@/components/client/home/Promo"));

export async function generateMetadata(): Promise<Metadata> {
  let logo: string = "";

  try {
    const res = await axios.get(`${process.env.WEB_URL}/api/setting/logo/get`);

    logo = res.data.data.image;
  } catch (error) {}

  const desc =
    "Welcome to the Bottle Time online shop. Here they sell various types of drinks such as beer, spirits and wine which are located in Bali.";

  const title = "Home | Bottle Time";

  return {
    title: title,
    description: desc,
    icons: logo,
    openGraph: {
      type: "website",
      url: "www.bottle-time.com",
      title: title,
      description: desc,
      siteName: "Home",
      images: [logo],
    },
    keywords: ["bottle time", "bottle times", ...keywords],
  };
}

const Home = async () => {
  const session = await getServerSession(authOptions);

  let thisCountCarts: number = 0;

  if (session?.user.role === "member") {
    let isUserActive: boolean = false;

    let user404: boolean = false;

    try {
      const { user } = await useGetUserByEmailHook();

      isUserActive = user.active;
    } catch (error: any) {
      if (error.response.status === 404) user404 = true;
    } finally {
      if (isUserActive === false) redirect("/announcement");
      if (user404) redirect("/denied");
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
  }

  const setting = await axios.get(`${process.env.WEB_URL}/api/setting/get`);

  const settingValue = setting.data.data;

  return (
    <React.Fragment>
      <ToastContainer />

      <main className="min-h-screen !w-full overflow-x-hidden">
        {session?.user.role === "member" ? (
          <Navbar countCarts={thisCountCarts} role={session?.user.role} />
        ) : (
          <Navbar />
        )}
        <Hero />
        <Products title="best seller" statusProduct="best" />
        <Products title="new" statusProduct="new" />
        <Products title="sale" statusProduct="sale" />
        <Promo />
        <Footer settingValue={settingValue} />
      </main>
    </React.Fragment>
  );
};

export default Home;
