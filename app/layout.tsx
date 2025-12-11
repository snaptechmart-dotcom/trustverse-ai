import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Trustverse AI",
  description: "AI Tools, Automation & Productivity Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Main Page Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer at the bottom */}
        <Footer />

      </body>
    </html>
  );
}
