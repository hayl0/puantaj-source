"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  Play,
  Menu,
  X,
  Building2,
  Globe,
  Award,
  CreditCard,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// --- Components ---

const FeatureIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
    <Icon className="w-6 h-6" />
  </div>
);

const SectionHeader = ({ badge, title, subtitle }: { badge: string, title: string, subtitle: string }) => (
  <div className="text-center max-w-3xl mx-auto mb-16 px-4">
    <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 text-primary bg-primary/5 text-sm uppercase tracking-wider">
      {badge}
    </Badge>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
      {title}
    </h2>
    <p className="text-lg text-muted-foreground leading-relaxed">
      {subtitle}
    </p>
  </div>
);

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  popular = false, 
  delay = 0 
}: { 
  title: string, 
  price: string, 
  description: string, 
  features: string[], 
  popular?: boolean, 
  delay?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`relative p-8 rounded-3xl border ${popular ? 'border-primary shadow-2xl shadow-primary/10' : 'border-border bg-card/50'} backdrop-blur-sm flex flex-col h-full hover:border-primary/50 transition-colors duration-300`}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm font-medium shadow-lg">En Popüler</Badge>
      </div>
    )}
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Ücretsiz' && <span className="text-muted-foreground">/ay</span>}
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm">
          <CheckCircle className="w-5 h-5 text-primary shrink-0" />
          <span className="text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>
    <Button className={`w-full h-12 rounded-xl font-medium ${popular ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80'}`}>
      Hemen Başla
    </Button>
  </motion.div>
);

const TestimonialCard = ({ name, role, company, content, image, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-8 rounded-3xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300"
  >
    <div className="flex items-center gap-1 mb-6 text-yellow-500">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
    </div>
    <p className="text-lg text-foreground/80 mb-8 leading-relaxed">"{content}"</p>
    <div className="flex items-center gap-4">
      <Avatar className="w-12 h-12 border-2 border-primary/10">
        <AvatarImage src={image} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-bold text-foreground">{name}</div>
        <div className="text-sm text-muted-foreground">{role}, {company}</div>
      </div>
    </div>
  </motion.div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-6 text-left hover:text-primary transition-colors"
      >
        <span className="text-lg font-medium">{question}</span>
        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-110 duration-300">
              <Image src="/logo.svg" alt="Puantaj Pro Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Puantaj Pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Özellikler</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">Nasıl Çalışır?</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Fiyatlandırma</Link>
            <Link href="#faq" className="hover:text-primary transition-colors">SSS</Link>
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
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Giriş Yap</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25">
                  Ücretsiz Dene <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-0 right-0 bg-background border-b border-border z-40 md:hidden overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium">Özellikler</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium">Nasıl Çalışır?</Link>
              <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium">Fiyatlandırma</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-medium text-primary">Giriş Yap</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center">Ücretsiz Dene</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div style={{ opacity, scale }} className="text-center max-w-5xl mx-auto">
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
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent leading-[1.1]"
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

      {/* Trusted By Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-8">200+ İşletme Tarafından Güvenle Kullanılıyor</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholder Logos using Text/Icons for demo purposes */}
             {[
               { icon: Building2, text: "TECH CORP" },
               { icon: Globe, text: "GLOBAL Lojistik" },
               { icon: Award, text: "PREMIUM Yapı" },
               { icon: Zap, text: "ENERGY Plus" },
               { icon: ShieldCheck, text: "SECURE Systems" }
             ].map((Logo, i) => (
               <div key={i} className="flex items-center gap-2 font-bold text-xl">
                 <Logo.icon className="w-8 h-8" />
                 <span>{Logo.text}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <SectionHeader 
            badge="Özellikler"
            title="İhtiyacınız Olan Tüm Araçlar"
            subtitle="Karmaşık İK ve muhasebe süreçlerini basitleştiren, işletmenize özel çözümler."
          />

          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Calendar,
                title: "Akıllı Puantaj",
                desc: "Personel giriş-çıkışlarını, izinleri ve raporları tek ekrandan yönetin. Excel karmaşasına son verin."
              },
              {
                icon: Wallet,
                title: "Otomatik Maaş",
                desc: "Vergi, SGK ve kesintileri otomatik hesaplayın. Tek tıkla maaş bordrolarını oluşturun."
              },
              {
                icon: Clock,
                title: "Vardiya Planlama",
                desc: "Çakışmaları önleyen akıllı vardiya sistemi ile personelinizin çalışma saatlerini optimize edin."
              },
              {
                icon: BarChart,
                title: "Gelişmiş Raporlar",
                desc: "İşletmenizin performansını gerçek zamanlı grafiklerle izleyin. Veriye dayalı kararlar alın."
              },
              {
                icon: ShieldCheck,
                title: "KVKK Uyumlu",
                desc: "Verileriniz en yüksek güvenlik standartlarında şifrelenir ve yedeklenir. Güvenliğiniz önceliğimiz."
              },
              {
                icon: Zap,
                title: "Mobil Uyumlu",
                desc: "İster ofiste ister sahada. Tüm özelliklere mobil cihazlarınızdan kesintisiz erişin."
              }
            ].map((feature, i) => (
              <PremiumCard 
                key={i} 
                className="hover:border-primary/50 transition-colors group"
                delay={i * 0.1}
              >
                <div className="p-8 h-full">
                  <FeatureIcon icon={feature.icon} />
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </PremiumCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-secondary/20 relative">
        <div className="container mx-auto px-6">
          <SectionHeader 
            badge="Süreç"
            title="3 Adımda Kolay Kurulum"
            subtitle="Dakikalar içinde hesabınızı oluşturun ve işletmenizi yönetmeye başlayın."
          />
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/30" />
            
            {[
              { step: "01", title: "Hesap Oluştur", desc: "Şirket bilgilerinizi girerek ücretsiz hesabınızı oluşturun." },
              { step: "02", title: "Personel Ekle", desc: "Çalışanlarınızı sisteme davet edin veya Excel'den toplu aktarın." },
              { step: "03", title: "Yönetmeye Başla", desc: "Puantaj, maaş ve izin süreçlerini otomatik pilota alın." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-background rounded-full border-4 border-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-6 shadow-2xl relative z-10">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="container mx-auto px-6">
          <SectionHeader 
            badge="Fiyatlandırma"
            title="Şeffaf ve Esnek Paketler"
            subtitle="İşletmenizin büyüklüğüne uygun paketi seçin. Gizli ücret yok."
          />

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              title="Başlangıç"
              price="Ücretsiz"
              description="Küçük işletmeler ve deneme amaçlı kullanım için."
              features={["5 Personele Kadar", "Temel Puantaj", "Standart Raporlar", "E-posta Desteği"]}
              delay={0}
            />
            <PricingCard 
              title="Pro"
              price="₺990"
              description="Büyüyen işletmeler için tam kapsamlı çözüm."
              features={["50 Personele Kadar", "Gelişmiş Puantaj & Maaş", "Vardiya Yönetimi", "Öncelikli Destek", "Mobil Uygulama"]}
              popular={true}
              delay={0.1}
            />
            <PricingCard 
              title="Kurumsal"
              price="Özel Teklif"
              description="Büyük ölçekli organizasyonlar için sınırsız çözüm."
              features={["Sınırsız Personel", "Özel Entegrasyonlar", "Dedicated Sunucu", "7/24 Canlı Destek", "SLA Garantisi"]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6">
          <SectionHeader 
            badge="Referanslar"
            title="Müşterilerimiz Ne Diyor?"
            subtitle="Puantaj Pro'yu kullanan işletmelerin başarı hikayeleri."
          />

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Ahmet Yılmaz"
              role="İK Müdürü"
              company="TeknoSoft A.Ş."
              image="https://i.pravatar.cc/150?u=1"
              content="Excel tabloları arasında kaybolmaktan kurtulduk. Puantaj Pro ile tüm süreçlerimiz %80 hızlandı. Kesinlikle tavsiye ediyorum."
              delay={0}
            />
            <TestimonialCard 
              name="Ayşe Demir"
              role="Genel Müdür"
              company="Demir Lojistik"
              image="https://i.pravatar.cc/150?u=2"
              content="Vardiya takibi bizim için kabustu. Bu sistem sayesinde kimin ne zaman çalıştığını anlık görebiliyoruz. Harika bir arayüz."
              delay={0.1}
            />
            <TestimonialCard 
              name="Mehmet Öz"
              role="İşletme Sahibi"
              company="Öz Yapı Market"
              image="https://i.pravatar.cc/150?u=3"
              content="Maaş hesaplamalarındaki hatalar sıfıra indi. Personelim artık kendi panelinden izinlerini takip edebiliyor. Çok memnunuz."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeader 
            badge="SSS"
            title="Sıkça Sorulan Sorular"
            subtitle="Aklınıza takılan soruların cevaplarını burada bulabilirsiniz."
          />

          <div className="space-y-4">
            <FaqItem 
              question="Ücretsiz deneme süresi ne kadar?" 
              answer="Tüm özelliklerimizi 14 gün boyunca hiçbir kredi kartı bilgisi girmeden ücretsiz deneyebilirsiniz. Memnun kalırsanız size uygun paketi seçerek devam edebilirsiniz."
            />
            <FaqItem 
              question="Kurulum için teknik bilgi gerekiyor mu?" 
              answer="Hayır, Puantaj Pro bulut tabanlı bir sistemdir. Herhangi bir kurulum gerektirmez. İnternet tarayıcınızdan giriş yaparak hemen kullanmaya başlayabilirsiniz."
            />
            <FaqItem 
              question="Verilerim güvende mi?" 
              answer="Evet, verileriniz 256-bit SSL şifreleme ile korunmaktadır ve günlük olarak yedeklenmektedir. KVKK ve GDPR standartlarına tam uyumluyuz."
            />
            <FaqItem 
              question="Paket değişikliği yapabilir miyim?" 
              answer="İstediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Değişiklikler anında hesabınıza yansıtılır."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="rounded-[3rem] bg-gradient-to-br from-primary to-purple-900 p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px]" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Daha Verimli Bir İşletme İçin <br />İlk Adımı Atın</h2>
              <p className="text-xl text-blue-100 mb-10">
                14 gün boyunca tüm özellikleri ücretsiz deneyin. Kredi kartı gerekmez.
              </p>
              <Button size="lg" variant="secondary" className="h-14 px-10 rounded-full text-lg font-bold text-primary hover:bg-white">
                Ücretsiz Deneyin
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card pt-20 pb-10 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 relative">
                   <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl">Puantaj Pro</span>
              </div>
              <p className="text-muted-foreground mb-6">
                İşletmenizin İK ve finans süreçlerini dijitalleştirin, zamandan ve maliyetten tasarruf edin.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary"><Twitter className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary"><Instagram className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary"><Linkedin className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary"><Facebook className="w-5 h-5" /></Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Ürün</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Özellikler</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Fiyatlandırma</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Güvenlik</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Yol Haritası</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Kurumsal</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Kariyer</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">İletişim</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">İletişim</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>destek@puantajpro.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+90 (850) 123 45 67</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Levent, İstanbul</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Puantaj Pro. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary">Gizlilik Politikası</Link>
              <Link href="#" className="hover:text-primary">Kullanım Şartları</Link>
              <Link href="#" className="hover:text-primary">KVKK</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
