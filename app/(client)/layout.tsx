import axios from "axios";
import { Metadata } from "next";
import React, { Suspense } from "react";

import CartContextProvider from "@/context/CartContext";

import ClientLoading from "./loading";

export async function generateMetadata(): Promise<Metadata> {
  let logo: string = "";

  try {
    const res = await axios.get(`${process.env.WEB_URL}/api/setting/logo/get`);

    logo = res.data.data.image;
  } catch (error) {}

  return {
    icons: {
      icon: logo,
    },
  };
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ClientLoading />}>
      <CartContextProvider>{children}</CartContextProvider>
    </Suspense>
  );
}
