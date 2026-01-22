import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trustverse AI",
  description: "AI Trust & Reputation Platform",

  icons: {
    icon: "/favicon.ico",
  },

  verification: {
    google: "ATPktU3iWa8a4kZJ1yOjWLCPiVQoPMdkbIeXGUt_3zM",
  },

  openGraph: {
    title: "Trustverse AI",
    description: "AI Trust & Fraud Detection Platform",
    url: "https://trustverseai.com",
    siteName: "Trustverse AI",
    images: [
      {
        url: "/trustverse-logo.png",
        width: 512,
        height: 512,
        alt: "Trustverse AI Logo",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EYPDDSPKGN"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EYPDDSPKGN');
          `}
        </Script>

        {/* ✅ Paddle Checkout (SAFE ADD – NO LOGIC CHANGE) */}
        <Script
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="beforeInteractive"
        />
      </head>

      <body className="min-h-screen bg-white">
        <Providers>
          {/* 🔐 NAVBAR LAYER FIX (MOBILE SAFE) */}
          <div className="relative z-50 pointer-events-auto">
            <Navbar />
          </div>

          {/* 📄 MAIN CONTENT */}
          <main className="relative z-0">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
