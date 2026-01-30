import ProtectedRoute from '@/components/protected-route';
import PremiumSidebar from '@/components/premium/Sidebar';
import PremiumHeader from '@/components/premium/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex font-sans">
        <PremiumSidebar />
        <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
          <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] pointer-events-none" />
          <PremiumHeader />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative z-10">
            <div className="max-w-7xl mx-auto animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
