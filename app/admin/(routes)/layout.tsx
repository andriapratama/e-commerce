import AdminNavbar from "@/components/admin/Navbar";
import { Suspense } from "react";
import AdminLoading from "./loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminNavbar />
        <div className="pt-12 bg-gray-100">
          <Suspense fallback={<AdminLoading />}>{children}</Suspense>
        </div>
      </body>
    </html>
  );
}
