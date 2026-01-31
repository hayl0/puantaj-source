"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  BarChart, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  Zap,
  Shield,
  Smartphone,
  Menu,
  X,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Grid & Spotlights */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 opacity-30 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">Puantaj<span className="text-indigo-500">Pro</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Özellikler</Link>
            <Link href="#solutions" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Çözümler</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Fiyatlandırma</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <Link href="/register/admin">
              <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-medium transition-all hover:scale-105 active:scale-95">
                Ücretsiz Başla
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#030712] pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Özellikler</Link>
              <Link href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Çözümler</Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Giriş Yap</Link>
              <Link href="/register/admin" onClick={() => setMobileMenuOpen(false)} className="text-indigo-400 font-bold">Ücretsiz Başla</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Yapay Zeka Destekli Personel Yönetimi</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
                Geleceğin <br />
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Çalışma Alanı</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
                Puantaj Pro ile personel takibi, vardiya planlama ve maaş hesaplamalarını tek bir modern platformda birleştirin. Karmaşık Excel tablolarına veda edin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/register/admin">
                  <Button className="h-14 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-500/25 w-full sm:w-auto">
                    Hemen Başlayın <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-lg font-medium backdrop-blur-sm transition-all w-full sm:w-auto">
                    Canlı Demo
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* 3D Dashboard Mockup */}
            <motion.div 
              style={{ y: heroY, opacity }}
              className="mt-20 relative w-full perspective-[2000px]"
            >
              <div className="relative rounded-xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden transform rotate-x-12 hover:rotate-x-0 transition-transform duration-1000 ease-out group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Mockup Header */}
                <div className="h-12 border-b border-white/10 bg-[#0B0F19] flex items-center px-4 gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="ml-4 h-6 w-64 rounded bg-white/5 border border-white/5" />
                </div>

                {/* Mockup Content */}
                <div className="p-8 grid grid-cols-12 gap-6 bg-[#0B0F19] aspect-[16/9]">
                   {/* Sidebar */}
                   <div className="hidden md:block col-span-2 space-y-4">
                      <div className="h-8 w-full rounded bg-indigo-500/20" />
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-8 w-full rounded bg-white/5" />
                      ))}
                   </div>
                   
                   {/* Main Content */}
                   <div className="col-span-12 md:col-span-10 grid grid-cols-3 gap-6">
                      {/* Stats Cards */}
                      {[1,2,3].map(i => (
                        <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                          <div className="h-8 w-8 rounded bg-white/10" />
                          <div className="space-y-2">
                            <div className="h-6 w-16 rounded bg-white/10" />
                            <div className="h-4 w-24 rounded bg-white/5" />
                          </div>
                        </div>
                      ))}
                      
                      {/* Chart Area */}
                      <div className="col-span-3 h-64 rounded-xl bg-white/5 border border-white/5 p-6 relative overflow-hidden flex items-end gap-2">
                         {[40, 70, 45, 80, 55, 90, 60, 75, 50, 85, 65, 95].map((h, i) => (
                           <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex-1 bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-sm opacity-80"
                           />
                         ))}
                      </div>
                   </div>
                </div>
                
                {/* Glow Overlay */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl -z-10 group-hover:opacity-40 transition-opacity duration-500" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-10 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-slate-500 mb-8 font-medium">YENİLİKÇİ ŞİRKETLER TARAFINDAN GÜVENİLİYOR</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for logos - Text based for now */}
               {['Acme Corp', 'GlobalTech', 'Nebula', 'Vertex', 'Horizon'].map((company) => (
                 <span key={company} className="text-xl font-bold text-slate-300 hover:text-white transition-colors cursor-default">{company}</span>
               ))}
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Her Şey Kontrol Altında</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Modern işletmelerin ihtiyaç duyduğu tüm araçlar, tek bir güçlü platformda birleşti.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Feature 1 - Large */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 rounded-3xl p-8 bg-slate-900/50 border border-white/10 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                  <BarChart className="w-48 h-48 text-indigo-500 transform rotate-12 translate-x-10 -translate-y-10" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Gerçek Zamanlı Analitik</h3>
                  <p className="text-slate-400 text-lg max-w-md">Personel performansını, devamlılık oranlarını ve maliyet analizlerini anlık olarak takip edin. Veriye dayalı kararlar alın.</p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="rounded-3xl p-8 bg-slate-900/50 border border-white/10 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6 text-violet-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Mobil Uyumlu</h3>
                <p className="text-slate-400">QR kod ile temassız giriş-çıkış ve mobil izin talepleri.</p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="rounded-3xl p-8 bg-slate-900/50 border border-white/10 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Akıllı Vardiya</h3>
                <p className="text-slate-400">Çakışmaları önleyen otomatik vardiya planlama sistemi.</p>
              </motion.div>

              {/* Feature 4 - Large */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="md:col-span-2 rounded-3xl p-8 bg-slate-900/50 border border-white/10 backdrop-blur-sm relative overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                 <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Kurumsal Güvenlik</h3>
                      <p className="text-slate-400 text-lg">
                        Rol tabanlı yetkilendirme, KVKK uyumlu veri saklama ve şifreli veritabanı altyapısı ile verileriniz güvende.
                      </p>
                    </div>
                    <div className="w-full md:w-1/2 bg-[#0B0F19] rounded-xl border border-white/10 p-4 shadow-xl transform rotate-3 group-hover:rotate-0 transition-transform">
                       <div className="space-y-3">
                          <div className="flex items-center gap-3 p-2 rounded bg-white/5">
                             <div className="w-2 h-2 rounded-full bg-green-500" />
                             <div className="h-2 w-20 rounded bg-white/10" />
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded bg-white/5">
                             <div className="w-2 h-2 rounded-full bg-green-500" />
                             <div className="h-2 w-24 rounded bg-white/10" />
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded bg-white/5">
                             <div className="w-2 h-2 rounded-full bg-green-500" />
                             <div className="h-2 w-16 rounded bg-white/10" />
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 relative border-t border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Kullanıcılarımız Ne Diyor?
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Puantaj Pro'yu kullanan işletmelerin başarı hikayeleri.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-sm relative"
              >
                <div className="absolute top-8 right-8 text-indigo-500/20">
                  <Star className="w-12 h-12 fill-current" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                    AY
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Ahmet Yılmaz</h4>
                    <p className="text-slate-500 text-sm">İnsan Kaynakları Müdürü</p>
                    <p className="text-indigo-400 text-xs font-medium">TechSoft A.Ş.</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  "Personel takibini Excel tablolarından Puantaj Pro'ya taşıdık. Verimliliğimiz %40 arttı, maaş hesaplamaları artık dakikalar sürüyor."
                </p>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-sm relative"
              >
                <div className="absolute top-8 right-8 text-violet-500/20">
                  <Star className="w-12 h-12 fill-current" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-lg">
                    AD
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Ayşe Demir</h4>
                    <p className="text-slate-500 text-sm">Operasyon Direktörü</p>
                    <p className="text-violet-400 text-xs font-medium">Lojistik Plus</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  "Vardiya planlaması bizim için kabustu. Puantaj Pro'nun sürükle-bırak arayüzü ve otomatik çakışma kontrolü hayat kurtarıcı."
                </p>
              </motion.div>

              {/* Testimonial 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-sm relative"
              >
                <div className="absolute top-8 right-8 text-pink-500/20">
                  <Star className="w-12 h-12 fill-current" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-lg">
                    MK
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Mehmet Kaya</h4>
                    <p className="text-slate-500 text-sm">Genel Müdür</p>
                    <p className="text-pink-400 text-xs font-medium">Kaya İnşaat</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  "Saha ekiplerimizin takibi için QR kod özelliğini kullanıyoruz. Konum bazlı doğrulama sayesinde güvenilir veriler elde ediyoruz."
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10" />
             
             <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
               Ekibinizi Yönetmeye <br />
               <span className="text-indigo-400">Bugün Başlayın</span>
             </h2>
             <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
               14 gün boyunca tüm özellikleri ücretsiz deneyin. Kredi kartı gerekmez.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register/admin">
                  <Button className="h-16 px-10 rounded-full bg-white text-black hover:bg-slate-200 text-xl font-bold transition-all hover:scale-105 shadow-xl">
                    Ücretsiz Kayıt Ol
                  </Button>
                </Link>
             </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#02040a] pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                    <span className="text-lg font-bold text-white">P</span>
                  </div>
                  <span className="text-lg font-bold text-white">PuantajPro</span>
                </Link>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Yeni nesil personel yönetim platformu. İşletmenizi dijitalleştirin, verimliliği artırın.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6">Ürün</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link href="#features" className="hover:text-indigo-400 transition-colors">Özellikler</Link></li>
                  <li><Link href="#pricing" className="hover:text-indigo-400 transition-colors">Fiyatlandırma</Link></li>
                  <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Giriş Yap</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6">Şirket</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link href="/hakkimizda" className="hover:text-indigo-400 transition-colors">Hakkımızda</Link></li>
                  <li><Link href="/iletisim" className="hover:text-indigo-400 transition-colors">İletişim</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-6">Yasal</h4>
                <ul className="space-y-4 text-sm text-slate-400">
                  <li><Link href="/legal/gizlilik" className="hover:text-indigo-400 transition-colors">Gizlilik Politikası</Link></li>
                  <li><Link href="/legal/kullanim-sartlari" className="hover:text-indigo-400 transition-colors">Kullanım Şartları</Link></li>
                  <li><Link href="/legal/gizlilik" className="hover:text-indigo-400 transition-colors">KVKK</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-600 text-sm">© 2024 Puantaj Pro. Tüm hakları saklıdır.</p>
              <div className="flex gap-6">
                 {/* Social icons placeholder */}
                 <div className="w-5 h-5 bg-slate-800 rounded-full" />
                 <div className="w-5 h-5 bg-slate-800 rounded-full" />
                 <div className="w-5 h-5 bg-slate-800 rounded-full" />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
