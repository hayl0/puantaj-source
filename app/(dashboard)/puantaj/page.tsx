"use client";

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PuantajGrid, AggregateStats } from '@/components/premium/PuantajGrid';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Download, Upload, Filter, CheckCircle2, Clock, XCircle, Plane, FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';

const mockEmployees = [
  { id: "1", name: "Ahmet Yılmaz", department: "Yazılım" },
  { id: "2", name: "Ayşe Demir", department: "Tasarım" },
  { id: "3", name: "Mehmet Kaya", department: "Pazarlama" },
  { id: "4", name: "Fatma Şahin", department: "İnsan Kaynakları" },
  { id: "5", name: "Can Yıldız", department: "Yazılım" },
  { id: "6", name: "Zeynep Arslan", department: "Satış" },
  { id: "7", name: "Ali Veli", department: "Operasyon" },
  { id: "8", name: "Murat Can", department: "Yazılım" },
  { id: "9", name: "Selin Yücel", department: "Tasarım" },
  { id: "10", name: "Burak Öz", department: "Pazarlama" },
];

export default function PuantajPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || 'user';
  const userName = session?.user?.name || 'Kullanıcı';

  const [gridStats, setGridStats] = useState<AggregateStats>({
    present: 0,
    half: 0,
    absent: 0,
    leave: 0,
    report: 0
  });

  // If user, filter to show only themselves (mocking by name matching or just showing first one if no match)
  const displayedEmployees = useMemo(() => {
    return userRole === 'admin' 
      ? mockEmployees 
      : mockEmployees.filter(e => e.name === userName).length > 0 
        ? mockEmployees.filter(e => e.name === userName)
        : [mockEmployees[0]]; // Fallback for demo if name doesn't match
  }, [userRole, userName]);

  // Stats based on grid calculations
  const stats = [
    { label: 'Tam Gün', value: gridStats.present.toString(), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Yarım Gün', value: gridStats.half.toString(), icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Devamsız', value: gridStats.absent.toString(), icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'İzinli', value: gridStats.leave.toString(), icon: Plane, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Raporlu', value: gridStats.report.toString(), icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Puantaj Takibi" 
        description={userRole === 'admin' 
          ? "Personel devamlılık durumunu aylık çizelge üzerinden yönetin" 
          : `Sayın ${userName}, bu ayki devamlılık durumunuz`}
      >
        {userRole === 'admin' && (
          <>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtrele
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Excel'den Yükle
            </Button>
          </>
        )}
        <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/20">
          <Download className="w-4 h-4" />
          Rapor İndir
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <PremiumCard key={i} className="border-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>

      <div className={userRole !== 'admin' ? "pointer-events-none opacity-90" : ""}>
         {/* Using pointer-events-none for read-only effect for non-admins for now */}
        <PuantajGrid 
          employees={displayedEmployees} 
          onStatsChange={setGridStats}
        />
      </div>
    </div>
  );
}
