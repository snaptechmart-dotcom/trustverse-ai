import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./providers";
import { headers } from "next/headers";

export const metadata = {
  title: "Trustverse AI",
  description: "AI-powered trust verification platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";

  // Hide navbar & footer on dashboard and admin routes
  const hideLayout =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-[#020B14] text-white">
        <Providers>
          {!hideLayout && <Navbar />}
          <main className="min-h-screen">{children}</main>
          {!hideLayout && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
