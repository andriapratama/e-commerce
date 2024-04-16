import { Metadata } from "next";
import React, { Suspense } from "react";

import CartContextProvider from "@/context/CartContext";

import ClientLoading from "./loading";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata(): Promise<Metadata> {
  return {
    icons: {
      icon: `${process.env.WEB_URL}/logo.png`,
    },
  };
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartContextProvider>
      <Suspense fallback={<ClientLoading />}>{children}</Suspense>
    </CartContextProvider>
  );
}
