import ProtectedRoute from '@/components/protected-route';
import PremiumSidebar from '@/components/premium/Sidebar';
import PremiumHeader from '@/components/premium/Header';
import { SidebarProvider } from '@/components/providers/SidebarProvider';
import MobileSidebar from '@/components/premium/MobileSidebar';
import { BackgroundGrid } from '@/components/premium/BackgroundGrid';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen bg-background flex font-sans">
          <MobileSidebar />
          <div className="hidden lg:flex">
            <PremiumSidebar />
          </div>
          <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#030712]">
            {/* Background Grid & Spotlights - Matching Home Page */}
            <BackgroundGrid />
            
            <PremiumHeader />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative z-10">
              <div className="max-w-7xl mx-auto animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
