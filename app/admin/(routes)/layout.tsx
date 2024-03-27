import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import LoadingPageContextProvider from "@/context/LoadingPageContext";
import { authOptions } from "@/lib/auth";

import AdminLoading from "./loading";

const AdminNavbar = dynamic(() => import("@/components/admin/navbar/Navbar"));

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
