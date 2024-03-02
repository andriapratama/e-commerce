import AdminNavbar from "@/components/admin/navbar/Navbar";
import { Suspense } from "react";
import AdminLoading from "./loading";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoadingPageContextProvider from "@/context/LoadingPageContext";

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
