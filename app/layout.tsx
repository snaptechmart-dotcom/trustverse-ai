import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Trustverse AI",
  description: "AI-powered trust verification platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#020B14] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
