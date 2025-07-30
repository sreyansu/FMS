import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="w-64 fixed h-full">
        <Sidebar />
      </div>
      <main className="flex-1 ml-64 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
