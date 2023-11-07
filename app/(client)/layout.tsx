import Footer from "@/components/client/Footer";
import Navbar from "@/components/client/Navbar";
import Topbar from "@/components/client/Topbar";
import React from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <Topbar />
      <Navbar />
      {children}
      <Footer />
    </React.Fragment>
  );
}
