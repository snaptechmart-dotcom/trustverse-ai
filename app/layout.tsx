import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Trustverse AI",
  description: "AI Trust & Reputation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            background: "#f0f2f5",
          }}
        >
          {/* ✅ Sidebar wrapper (IMPORTANT FIX) */}
          <div style={{ flexShrink: 0 }}>
            <Sidebar />
          </div>

          {/* Right side (Navbar + Page Content) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main
              style={{
                flex: 1,
                padding: 24,
                overflowY: "auto",
              }}
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
