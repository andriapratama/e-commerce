import axios from "axios";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPageContextProvider from "@/context/LoadingPageContext";
import { authOptions } from "@/lib/auth";

import AdminLoading from "./loading";

const AdminNavbar = dynamic(() => import("@/components/admin/navbar/Navbar"));

export async function generateMetadata(): Promise<Metadata> {
  const desc =
    "Kelola situs dengan mudah. Atur semua dari satu dashboard. Optimalisasi mudah dengan admin kami.";

  const title = "Admin";

  return {
    title: title,
    description: desc,
    icons: {
      icon: "/logo.png",
    },
    openGraph: {
      type: "website",
      url: process.env.WEB_URL,
      title: title,
      description: desc,
      siteName: "Bottle Time",
      images: ["/logo.png"],
    },
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const session = await getServerSession(authOptions);

  return (
    <LoadingPageContextProvider>
      <AdminNavbar name={session?.user.name} role={session?.user.role} />
      <div className="pt-12 bg-gray-100">
        <Suspense fallback={<AdminLoading />}>{children}</Suspense>
      </div>
    </LoadingPageContextProvider>
  );
}
