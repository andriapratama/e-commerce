import React, { Suspense } from "react";
import ClientLoading from "./loading";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<ClientLoading />}>{children}</Suspense>;
}
