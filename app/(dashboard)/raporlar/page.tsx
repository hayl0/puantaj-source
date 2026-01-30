"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, FileText, BarChart, TrendingUp, Filter, Search,
  Calendar, Clock, Mail, Share2, MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const reports = [
  { id: 1, title: 'Aylık Personel Performansı', type: 'PDF', size: '2.4 MB', date: '01 Şub 2024', status: 'Hazır', category: 'Performans' },
  { id: 2, title: 'Ocak 2024 Finansal Durum', type: 'Excel', size: '3.1 MB', date: '31 Oca 2024', status: 'Hazır', category: 'Finans' },
  { id: 3, title: 'Puantaj Analiz Raporu', type: 'PDF', size: '1.8 MB', date: '30 Oca 2024', status: 'Hazır', category: 'Puantaj' },
  { id: 4, title: 'Vergi ve SGK Özeti', type: 'PDF', size: '4.2 MB', date: '29 Oca 2024', status: 'İnceleniyor', category: 'Yasal' },
  { id: 5, title: 'Yıllık Performans Karşılaştırması', type: 'Excel', size: '5.6 MB', date: '28 Oca 2024', status: 'Hazır', category: 'Performans' },
  { id: 6, title: 'Departman Bazlı Analiz', type: 'PDF', size: '2.9 MB', date: '27 Oca 2024', status: 'Hazır', category: 'Yönetim' },
];

const scheduledReports = [
    { id: 1, title: 'Haftalık Vardiya Özeti', frequency: 'Her Pazartesi', nextRun: '5 Şub 2024', recipients: 4 },
    { id: 2, title: 'Aylık Maaş Bordrosu', frequency: 'Her Ayın 1\'i', nextRun: '1 Mar 2024', recipients: 12 },
];

export default function RaporlarPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Raporlar ve Analizler" 
        description="Detaylı raporlama ve veri dışa aktarma merkezi"
      >
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtrele
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" />
            Toplu İndir
            </Button>
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

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-[400px] grid-cols-3">
                <TabsTrigger value="all">Tüm Raporlar</TabsTrigger>
                <TabsTrigger value="scheduled">Planlanmış</TabsTrigger>
                <TabsTrigger value="templates">Şablonlar</TabsTrigger>
            </TabsList>
            
            <div className="relative w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                    placeholder="Rapor ara..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <TabsContent value="all" className="space-y-4">
            <PremiumCard title="Rapor Arşivi">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rapor Adı</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Tür</TableHead>
                            <TableHead>Boyut</TableHead>
                            <TableHead>Oluşturulma Tarihi</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id} className="group cursor-pointer hover:bg-muted/50">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            report.type === 'PDF' 
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30' 
                                            : 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                        }`}>
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        {report.title}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="font-normal">
                                        {report.category}
                                    </Badge>
                                </TableCell>
                                <TableCell>{report.type}</TableCell>
                                <TableCell className="text-muted-foreground">{report.size}</TableCell>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10">
                                        {report.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </PremiumCard>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scheduledReports.map((report) => (
                    <PremiumCard key={report.id}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{report.title}</h3>
                                    <p className="text-sm text-muted-foreground">{report.frequency}</p>
                                </div>
                            </div>
                            <Badge>{report.recipients} Alıcı</Badge>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-lg">
                                <span className="text-muted-foreground">Sonraki Gönderim:</span>
                                <span className="font-medium">{report.nextRun}</span>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                                <Button className="flex-1" variant="outline">Düzenle</Button>
                                <Button className="flex-1">Şimdi Gönder</Button>
                            </div>
                        </div>
                    </PremiumCard>
                ))}
                
                <PremiumCard className="border-dashed border-2 flex items-center justify-center min-h-[200px] cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold">Yeni Planlama Oluştur</h3>
                        <p className="text-sm text-muted-foreground mt-1">Otomatik rapor gönderimi ayarla</p>
                    </div>
                </PremiumCard>
            </div>
        </TabsContent>

        <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PremiumCard title="Performans Raporu">
                    <p className="text-sm text-muted-foreground mb-4">
                        Personel verimliliği, devamsızlık ve hedef gerçekleştirme oranlarını içeren detaylı rapor şablonu.
                    </p>
                    <Button className="w-full" variant="secondary">Şablonu Kullan</Button>
                </PremiumCard>
                
                <PremiumCard title="Maaş Bordrosu">
                    <p className="text-sm text-muted-foreground mb-4">
                        Aylık maaş, kesinti, prim ve vergi hesaplamalarını içeren resmi formatta bordro şablonu.
                    </p>
                    <Button className="w-full" variant="secondary">Şablonu Kullan</Button>
                </PremiumCard>

                <PremiumCard title="Finansal Özet">
                    <p className="text-sm text-muted-foreground mb-4">
                        Gelir, gider, kar/zarar ve nakit akışı durumunu özetleyen yönetim raporu şablonu.
                    </p>
                    <Button className="w-full" variant="secondary">Şablonu Kullan</Button>
                </PremiumCard>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
