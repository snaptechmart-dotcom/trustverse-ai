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
  const pathname = headers().get("x-pathname") || "";

  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="bg-[#020B14] text-white">
        <Providers>
          {!hideNavbar && <Navbar />}
          <main className="min-h-screen">{children}</main>
          {!hideNavbar && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
