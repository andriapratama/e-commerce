import AdminNavbar from "@/components/admin/Navbar";
import { Suspense } from "react";
import AdminLoading from "./loading";
import Provider from "@/components/Provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <>
      <AdminNavbar />
      <div className="pt-12 bg-gray-100">
        <Suspense fallback={<AdminLoading />}>{children}</Suspense>
      </div>
    </>
  );
}
