"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  BarChart, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Layout,
  Calendar,
  Clock,
  Wallet,
  FileText,
  Star,
  ChevronRight,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-20 dark:opacity-10" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none opacity-20" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110 duration-300">
              <Image 
                src="/logo.svg" 
                alt="Puantaj Pro Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Puantaj Pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Özellikler</Link>
            <Link href="#solutions" className="hover:text-primary transition-colors">Çözümler</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Fiyatlandırma</Link>
          </div>

          <div className="flex items-center gap-4">
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full hover:bg-primary/10"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </Button>
            )}
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Giriş Yap</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25">
                Ücretsiz Dene <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            style={{ opacity, scale }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8 hover:bg-primary/10 transition-colors cursor-default"
            >
              <Badge variant="default" className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider">Yeni</Badge>
              <span className="text-sm font-medium text-primary">Puantaj Pro v2.0 Yayında</span>
              <ChevronRight className="w-4 h-4 text-primary/50" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent leading-[1.1]"
            >
              İşletmenizi <br />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x">Geleceğe Taşıyın</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Yapay zeka destekli personel yönetimi, otomatik bordrolama ve finansal analiz araçlarıyla tüm süreçlerinizi tek bir platformdan yönetin.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 bg-primary">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-secondary/50 backdrop-blur-sm gap-2">
                <Play className="w-4 h-4 fill-current" />
                Tanıtım Filmi
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-white/5 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Aktif Personel" },
              { value: "%99.9", label: "Sistem Uptime" },
              { value: "₺500M+", label: "İşlenen Maaş" },
              { value: "7/24", label: "Canlı Destek" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase 1: Puantaj */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 mb-6">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-bold">Akıllı Puantaj</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Zaman Takibini <br />Otomatiğe Bağlayın</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Personel giriş-çıkışlarını QR kod, yüz tanıma veya konum bazlı sistemlerle anlık takip edin. Eksik günleri, izinleri ve raporları tek ekrandan yönetin.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Otomatik vardiya çakışma kontrolü",
                  "Tek tıkla aylık puantaj özeti",
                  "Excel ve PDF dışa aktarma",
                  "Mobil uyumlu çalışan paneli"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="rounded-full">Detaylı İncele</Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
              <PremiumCard className="relative z-10 border-blue-500/20 bg-background/50 backdrop-blur-xl">
                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-lg">Haziran 2024 Puantajı</div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Tamamlandı</Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Ahmet Yılmaz", status: "Tam", color: "bg-green-500" },
                      { name: "Ayşe Demir", status: "Yarım", color: "bg-blue-500" },
                      { name: "Mehmet Kaya", status: "İzinli", color: "bg-purple-500" },
                    ].map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{p.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.color}`} />
                          <span className="text-sm text-muted-foreground">{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase 2: Finans */}
      <section className="py-32 bg-secondary/5 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 mb-6">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-bold">Finans & Maaş</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Hatasız Maaş <br />Hesaplama</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Puantaj verileriyle entegre çalışan maaş modülü sayesinde mesai, kesinti ve primleri saniyeler içinde hesaplayın.
              </p>
              <Button variant="outline" className="rounded-full">Finans Modülünü Gör</Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="grid grid-cols-2 gap-4">
                <PremiumCard className="col-span-2 border-green-500/20 bg-background/50 backdrop-blur-xl">
                  <div className="flex items-center gap-4 p-2">
                    <div className="p-3 rounded-full bg-green-500/20 text-green-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Toplam Ödenen Maaş</div>
                      <div className="text-2xl font-bold">₺452,000</div>
                    </div>
                  </div>
                </PremiumCard>
                <PremiumCard className="border-border/50 bg-background/50 backdrop-blur-xl">
                  <div className="p-2 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Bekleyen</div>
                    <div className="text-xl font-bold text-orange-500">3 Personel</div>
                  </div>
                </PremiumCard>
                <PremiumCard className="border-border/50 bg-background/50 backdrop-blur-xl">
                  <div className="p-2 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Onaylanan</div>
                    <div className="text-xl font-bold text-green-500">42 Personel</div>
                  </div>
                </PremiumCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-32" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">İhtiyacınız Olan Tüm Araçlar</h2>
            <p className="text-lg text-muted-foreground">
              Modern işletmelerin ihtiyaç duyduğu tüm özellikler tek bir çatı altında toplandı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Vardiya Planlama",
                desc: "Sürükle bırak ile haftalık vardiya çizelgeleri oluşturun, personele otomatik bildirim gönderin."
              },
              {
                icon: FileText,
                title: "Gelişmiş Raporlar",
                desc: "Departman bazlı maliyet analizleri, devamlılık grafikleri ve performans raporları."
              },
              {
                icon: ShieldCheck,
                title: "KVKK Uyumlu",
                desc: "Verileriniz şifreli sunucularda, KVKK ve GDPR standartlarına uygun saklanır."
              },
              {
                icon: Users,
                title: "Personel Portalı",
                desc: "Çalışanlar kendi izinlerini talep edebilir, bordrolarını görüntüleyebilir."
              },
              {
                icon: Zap,
                title: "Hızlı Entegrasyon",
                desc: "Mevcut muhasebe ve ERP sistemlerinizle kolayca entegre olur."
              },
              {
                icon: Star,
                title: "7/24 Destek",
                desc: "Uzman destek ekibimiz her türlü sorunuzda yanınızda."
              }
            ].map((feature, i) => (
              <PremiumCard 
                key={i} 
                className="hover:border-primary/50 transition-colors"
                delay={i * 0.1}
              >
                <div className="p-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="rounded-[3rem] bg-gradient-to-br from-primary to-purple-900 p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px]" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Daha Verimli Bir İşletme İçin <br />İlk Adımı Atın</h2>
              <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                14 gün boyunca tüm özellikleri ücretsiz deneyin. Kurulum gerekmez, hemen kullanmaya başlayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="h-16 px-10 rounded-full text-xl font-bold text-primary hover:bg-white shadow-lg hover:scale-105 transition-transform">
                    Ücretsiz Deneyin
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-xl border-white/30 text-white hover:bg-white/10">
                    Bize Ulaşın
                  </Button>
                </Link>
              </div>
              <div className="mt-8 text-sm text-blue-200 opacity-80">
                * Kredi kartı gerekmez. İptal etmek için taahhüt yok.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image 
                    src="/logo.svg" 
                    alt="Puantaj Pro Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-xl">Puantaj Pro</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Modern işletmeler için geliştirilmiş, yapay zeka destekli personel yönetim ve puantaj platformu.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Özellikler</Link></li>
                <li><Link href="#" className="hover:text-primary">Fiyatlandırma</Link></li>
                <li><Link href="#" className="hover:text-primary">Entegrasyonlar</Link></li>
                <li><Link href="#" className="hover:text-primary">Güncellemeler</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Hakkımızda</Link></li>
                <li><Link href="#" className="hover:text-primary">Kariyer</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">İletişim</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Kullanım Koşulları</Link></li>
                <li><Link href="#" className="hover:text-primary">Gizlilik Politikası</Link></li>
                <li><Link href="#" className="hover:text-primary">KVKK Aydınlatma</Link></li>
                <li><Link href="#" className="hover:text-primary">Çerez Politikası</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 Puantaj Pro. Tüm hakları saklıdır.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary">Twitter</Link>
              <Link href="#" className="hover:text-primary">LinkedIn</Link>
              <Link href="#" className="hover:text-primary">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
