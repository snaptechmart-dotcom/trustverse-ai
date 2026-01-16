import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trustverse AI",
  description: "AI Trust & Reputation Platform",

  // ✅ FAVICON (MOST IMPORTANT)
  icons: {
    icon: "/favicon.ico",
  },

  // ✅ Google Search Console
  verification: {
    google: "ATPktU3iWa8a4kZJ1yOjWLCPiVQoPMdkbIeXGUt_3zM",
  },

  // ✅ Better Google Branding (optional but powerful)
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
      </head>

      <body className="min-h-screen bg-white">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
