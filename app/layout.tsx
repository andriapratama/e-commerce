import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import Provider from "@/components/Provider";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
