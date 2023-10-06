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
        <div className="pt-12">{children}</div>
      </body>
    </html>
  );
}
