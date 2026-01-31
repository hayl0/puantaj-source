"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PuantajGrid } from '@/components/premium/PuantajGrid';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Download, Upload, Filter, CheckCircle2, Clock, XCircle, Plane, FileText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

export default function PuantajPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = (session?.user as any)?.role || 'user';
  const userName = session?.user?.name || 'Kullanıcı';
  const userEmail = session?.user?.email;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/employees');
        if (res.ok) {
          const data = await res.json();
          
          if (userRole === 'personnel' || userRole === 'user') {
            // Filter for self if not admin
            // Note: This is client-side filtering. For security, API should handle this.
            // But for now, we just want to show the correct view.
            const self = data.filter((e: any) => e.email === userEmail);
            setEmployees(self);
          } else {
            setEmployees(data);
          }
        } else {
          console.error("Failed to fetch employees");
          toast({
            variant: "destructive",
            title: "Hata",
            description: "Personel listesi yüklenemedi.",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchEmployees();
    }
  }, [session, userRole, userEmail, toast]);

  // Placeholder stats - in a real app these would be calculated from the grid data
  const stats = [
    { label: 'Tam Gün', value: '0', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Yarım Gün', value: '0', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Devamsız', value: '0', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'İzinli', value: '0', icon: Plane, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Raporlu', value: '0', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' },
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
        {loading ? (
           <div className="flex justify-center p-8 text-muted-foreground">Yükleniyor...</div>
        ) : (
           <PuantajGrid employees={employees} />
        )}
      </div>
    </div>
  );
}
