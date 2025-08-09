import SideBar from "../components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar/>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
