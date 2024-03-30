import axios from "axios";
import { Metadata } from "next";
import React, { Suspense } from "react";

import CartContextProvider from "@/context/CartContext";

import ClientLoading from "./loading";

export async function generateMetadata(): Promise<Metadata> {
  return {
    icons: {
      icon: "/logo.png",
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
