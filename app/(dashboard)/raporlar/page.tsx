"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, FileText, BarChart, TrendingUp, Filter, Search, Loader2 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { format, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import dynamic from 'next/dynamic';
import { PayrollPDF } from '@/components/reports/PayrollPDF';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <Button disabled variant="outline"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Hazırlanıyor...</Button> }
);

export default function RaporlarPage() {
  const { data: session } = useSession();
  // Protect Admin Route
  const userRole = (session?.user as any)?.role;
  if (session && userRole !== 'admin' && userRole !== 'user') {
      redirect('/dashboard');
  }

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [reportData, setReportData] = useState<any[]>([]);
  const [readyToDownload, setReadyToDownload] = useState(false);

  // Generate last 6 months options
  const monthOptions = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(new Date(), i);
      return {
          value: format(date, 'yyyy-MM'),
          label: format(date, 'MMMM yyyy', { locale: tr })
      };
  });

  const fetchReportData = async () => {
      try {
          setLoading(true);
          setReadyToDownload(false);
          // Fetch payroll data for the selected month
          const res = await fetch(`/api/payrolls?month=${selectedMonth}`);
          if (res.ok) {
              const data = await res.json();
              setReportData(data);
              setReadyToDownload(true);
              toast({
                  title: "Rapor Hazır",
                  description: "Rapor verisi başarıyla çekildi. İndirebilirsiniz.",
              });
          } else {
              throw new Error("Failed to fetch data");
          }
      } catch (error) {
          console.error(error);
          toast({
              variant: "destructive",
              title: "Hata",
              description: "Rapor verisi alınamadı.",
          });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Raporlar ve Analizler" 
        description="Detaylı raporlama ve veri dışa aktarma merkezi"
      >
        <div className="flex items-center gap-3">
             <Select value={selectedMonth} onValueChange={(val) => {
                 setSelectedMonth(val);
                 setReadyToDownload(false);
             }}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ay Seçin" />
                </SelectTrigger>
                <SelectContent>
                    {monthOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            
            <Button 
                onClick={fetchReportData} 
                disabled={loading}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-600/20"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Raporu Hazırla
            </Button>

            {readyToDownload && (
                <PDFDownloadLink
                    document={<PayrollPDF data={reportData} month={selectedMonth} />}
                    fileName={`maas-raporu-${selectedMonth}.pdf`}
                >
                    {({ blob, url, loading: pdfLoading, error }) => (
                        <Button variant="outline" disabled={pdfLoading} className="gap-2">
                            {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            PDF İndir
                        </Button>
                    )}
                </PDFDownloadLink>
            )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumCard className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium">Toplam Rapor</p>
                <h2 className="text-4xl font-bold mt-2">24</h2>
                <p className="text-blue-100/80 text-sm mt-1">aktif rapor şablonu</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-medium">Aylık İndirme</p>
                <h2 className="text-4xl font-bold mt-2">214</h2>
                <div className="flex items-center gap-1 text-green-100/80 text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18% artış</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Download className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium">Veri Boyutu</p>
                <h2 className="text-4xl font-bold mt-2">3.2<span className="text-2xl font-normal">GB</span></h2>
                <p className="text-purple-100/80 text-sm mt-1">arşivlenmiş veri</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <BarChart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium">En Popüler</p>
                <h2 className="text-2xl font-bold mt-2 truncate">Puantaj Analiz</h2>
                <p className="text-orange-100/80 text-sm mt-1">51 indirme / ay</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PremiumCard className="lg:col-span-2" title="Rapor Önizleme">
          {readyToDownload && reportData.length > 0 ? (
              <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg">Maaş Bordrosu Özeti - {selectedMonth}</h3>
                          <Badge variant="outline">{reportData.length} Kayıt</Badge>
                      </div>
                      <div className="space-y-2">
                          {reportData.slice(0, 5).map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm p-2 bg-card rounded border">
                                  <span>{item.employee.name}</span>
                                  <span className="font-mono">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount)}</span>
                              </div>
                          ))}
                          {reportData.length > 5 && (
                              <div className="text-center text-xs text-muted-foreground pt-2">
                                  ... ve {reportData.length - 5} daha fazla
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed rounded-xl">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Rapor verisi görüntülemek için "Raporu Hazırla" butonuna tıklayın.</p>
            </div>
          )}
        </PremiumCard>

        <PremiumCard title="Hızlı Rapor Oluştur">
          <div className="space-y-4">
            <div className="p-4 rounded-xl border bg-card/50 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedMonth(format(new Date(), 'yyyy-MM'))}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-semibold">Bordro Özeti</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Seçili dönem için tüm personel maaş ve kesinti dökümleri.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border bg-card/50 hover:border-primary/50 transition-colors cursor-pointer opacity-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                  <BarChart className="w-4 h-4" />
                </div>
                <h4 className="font-semibold">Performans Raporu (Yakında)</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Personel verimliliği ve hedeflerin durumunu analiz eden detaylı rapor.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
