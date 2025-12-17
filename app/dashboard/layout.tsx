export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ color: "red" }}>DASHBOARD LAYOUT ACTIVE</h1>
      {children}
    </div>
  );
}
