"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Mail, Phone, MessageCircle, FileQuestion, BookOpen } from 'lucide-react';

const faqs = [
  {
    question: "Puantaj kayıtlarını nasıl düzenleyebilirim?",
    answer: "Puantaj sayfasında ilgili personeli seçtikten sonra takvim üzerinde güne tıklayarak çalışma saatlerini veya izin durumunu güncelleyebilirsiniz."
  },
  {
    question: "Maaş hesaplamaları otomatik mi yapılıyor?",
    answer: "Evet, sistem girilen çalışma saatleri, fazla mesailer ve kesintiler üzerinden maaşları otomatik olarak hesaplar ve bordro taslağını oluşturur."
  },
  {
    question: "Yeni personel ekleme sınırı var mı?",
    answer: "Paketiniz dahilinde sınırsız sayıda personel ekleyebilirsiniz. Enterprise sürümünde herhangi bir kısıtlama bulunmamaktadır."
  },
  {
    question: "Mobil uygulamayı nasıl indirebilirim?",
    answer: "App Store ve Google Play Store üzerinden 'Puantaj Pro' uygulamasını indirerek mevcut kullanıcı bilgilerinizle giriş yapabilirsiniz."
  },
  {
    question: "Raporları hangi formatlarda alabilirim?",
    answer: "Tüm raporları PDF, Excel (XLSX) ve CSV formatlarında dışa aktarabilirsiniz."
  }
];

export default function YardimPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Yardım Merkezi" 
        description="Sıkça sorulan sorular ve destek hattı"
      />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-10 blur-xl" />
        <div className="relative bg-card border rounded-2xl p-8 md:p-12 text-center space-y-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <h2 className="text-3xl font-bold tracking-tight">Size nasıl yardımcı olabiliriz?</h2>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Sorunuzu arayın (örn: maaş hesaplama, izin ekleme)" 
              className="pl-12 h-12 text-lg shadow-lg border-primary/20 focus-visible:ring-primary/30"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PremiumCard title="Sıkça Sorulan Sorular">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </PremiumCard>
          
          <PremiumCard title="Video Rehberler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Başlangıç Rehberi', duration: '5:20' },
                { title: 'Puantaj Yönetimi', duration: '8:45' },
                { title: 'Maaş ve Bordro', duration: '12:10' },
                { title: 'Raporlama Araçları', duration: '6:30' }
              ].map((video, i) => (
                <div key={i} className="group relative aspect-video rounded-xl bg-muted overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-primary border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-bold text-sm shadow-black drop-shadow-md">{video.title}</p>
                    <p className="text-xs opacity-80">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>

        <div className="space-y-6">
          <PremiumCard title="İletişim Kanalları">
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start h-auto py-4 px-4 gap-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Canlı Destek</p>
                  <p className="text-xs text-muted-foreground">7/24 anında yanıt</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto py-4 px-4 gap-4 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 hover:border-green-200">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">E-posta Gönder</p>
                  <p className="text-xs text-muted-foreground">destek@puantajpro.com</p>
                </div>
              </Button>

              <Button variant="outline" className="w-full justify-start h-auto py-4 px-4 gap-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 hover:border-purple-200">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Bizi Arayın</p>
                  <p className="text-xs text-muted-foreground">+90 850 123 45 67</p>
                </div>
              </Button>
            </div>
          </PremiumCard>

          <PremiumCard className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
            <div className="space-y-4 text-center py-4">
              <BookOpen className="w-12 h-12 mx-auto opacity-90" />
              <div>
                <h3 className="font-bold text-lg">Dokümantasyon</h3>
                <p className="text-indigo-100 text-sm mt-1">
                  Sistemi tüm detaylarıyla öğrenmek için kullanım kılavuzunu inceleyin.
                </p>
              </div>
              <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-white/90">
                Kılavuzu İncele
              </Button>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
