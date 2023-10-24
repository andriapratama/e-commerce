import AdminNavbar from "@/components/admin/Navbar";
import { Suspense } from "react";
import AdminLoading from "./loading";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <AdminNavbar name={session?.user.name} role={session?.user.role} />
      <div className="pt-12 bg-gray-100">
        <Suspense fallback={<AdminLoading />}>{children}</Suspense>
      </div>
    </>
  );
}
