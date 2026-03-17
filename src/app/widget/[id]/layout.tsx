export default function WidgetLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{ margin: 0, padding: 0, width: "100%", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
