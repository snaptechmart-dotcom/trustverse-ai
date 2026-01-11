import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

export const metadata = {
  title: "Trustverse AI",
  description: "AI Trust & Reputation Platform",

  // ✅ Google Search Console Verification (ADDED)
  verification: {
    google: "ATPktU3iWa8a4kZJ1yOjWLCPiVQoPMdkbIeXGUt_3zM",
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
