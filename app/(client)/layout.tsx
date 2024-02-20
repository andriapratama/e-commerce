import React, { Suspense } from "react";
import ClientLoading from "./loading";
import CartContextProvider from "@/context/CartContext";

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
