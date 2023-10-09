import AdminNavbar from "@/components/admin/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminNavbar />
        <div className="pt-12 bg-gray-100">{children}</div>
      </body>
    </html>
  );
}
