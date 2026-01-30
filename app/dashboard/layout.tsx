import ProfessionalSidebar from '@/components/ProfessionalSidebar'
import ProfessionalNavbar from '@/components/ProfessionalNavbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <ProfessionalSidebar />
      <div className="flex-1">
        <ProfessionalNavbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
