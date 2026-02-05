"use client"

import { Link } from '@/i18n/routing'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  BarChart, 
  Clock, 
  ArrowRight, 
  Shield,
  Smartphone,
  Menu,
  X,
  Star,
  LayoutDashboard,
  Calendar,
  Wallet,
  FileText,
  Bell,
  Search,
  Check,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/Logo'
import { BackgroundGrid } from '@/components/premium/BackgroundGrid'
import PlasmaSphere from '@/components/premium/PlasmaSphere'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HomePage() {
  const t = useTranslations('Common')
  const tHome = useTranslations('HomePage')
  
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const { scrollY } = useScroll()
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 50])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Grid & Spotlights */}
      <BackgroundGrid fixed />
      <PlasmaSphere />

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{t('features')}</Link>
            <Link href="#solutions" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{t('solutions')}</Link>
            {/* <Link href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{t('pricing')}</Link> */}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {t('login')}
            </Link>
            <Button asChild className="bg-white text-black hover:bg-slate-200 rounded-full px-6 font-medium transition-all hover:scale-105 active:scale-95">
              <Link href="/register/admin">
                {t('register')}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button className="text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
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
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">{t('features')}</Link>
              <Link href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">{t('solutions')}</Link>
              {/* <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">{t('pricing')}</Link> */}
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">{t('login')}</Link>
              <Link href="/register/admin" onClick={() => setMobileMenuOpen(false)} className="text-indigo-400 font-bold">{t('register')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                {tHome('badge')}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white leading-tight animate-fade-in-up delay-100 px-2">
              {tHome('heroTitlePrefix')} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                {tHome('heroTitleSuffix')}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed animate-fade-in-up delay-200 px-4">
              {tHome('heroDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-300 px-4">
              <Button size="lg" className="h-14 px-8 text-lg rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-105 transition-all shadow-lg shadow-indigo-500/25 w-full sm:w-auto" asChild>
                <Link href="/register/admin">
                  {t('register')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-white/10 hover:bg-white/5 backdrop-blur-sm w-full sm:w-auto" asChild>
                <Link href="/dashboard">
                  {tHome('liveDemo')}
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Dashboard Preview */}
          <motion.div 
            style={{ y: heroY }}
            className="mt-20 relative mx-auto max-w-5xl animate-fade-in-up delay-500 px-4"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl group">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
              
              {/* Floating Cards */}
              <div className="absolute -left-12 top-1/4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md shadow-2xl animate-float hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{tHome('mockup.stats.totalPersonnel')}</p>
                    <p className="text-xl font-bold text-white">48</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +12%
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/3 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md shadow-2xl animate-float delay-1000 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-500/20 text-violet-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{tHome('mockup.stats.activeShifts')}</p>
                    <p className="text-xl font-bold text-white">12</p>
                    <p className="text-xs text-slate-400">{tHome('mockup.stats.workingNow')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content wrapper closing tag was missing in previous step */}
      <main>
      
      {/* Features Section */}
      <section id="features" className="py-32 relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{tHome('features.title')}</h2>
              <p className="text-slate-400 text-lg">
                {tHome('features.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-6 h-6 text-blue-400" />,
                  title: tHome('features.items.personnel.title'),
                  desc: tHome('features.items.personnel.desc')
                },
                {
                  icon: <Calendar className="w-6 h-6 text-purple-400" />,
                  title: tHome('features.items.shifts.title'),
                  desc: tHome('features.items.shifts.desc')
                },
                {
                  icon: <Wallet className="w-6 h-6 text-green-400" />,
                  title: tHome('features.items.payroll.title'),
                  desc: tHome('features.items.payroll.desc')
                },
                {
                  icon: <FileText className="w-6 h-6 text-yellow-400" />,
                  title: tHome('features.items.reporting.title'),
                  desc: tHome('features.items.reporting.desc')
                },
                {
                  icon: <Shield className="w-6 h-6 text-red-400" />,
                  title: tHome('features.items.security.title'),
                  desc: tHome('features.items.security.desc')
                },
                {
                  icon: <Smartphone className="w-6 h-6 text-indigo-400" />,
                  title: tHome('features.items.mobile.title'),
                  desc: tHome('features.items.mobile.desc')
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 bg-[#0B0F19] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{tHome('testimonials.title')}</h2>
              <p className="text-slate-400 text-lg">
                {tHome('testimonials.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: tHome('testimonials.items.1.quote'),
                  author: "Ahmet Yılmaz",
                  role: tHome('testimonials.items.1.role'),
                  company: "TechSoft A.Ş."
                },
                {
                  quote: tHome('testimonials.items.2.quote'),
                  author: "Ayşe Demir",
                  role: tHome('testimonials.items.2.role'),
                  company: "Lojistik Plus"
                },
                {
                  quote: tHome('testimonials.items.3.quote'),
                  author: "Mehmet Kaya",
                  role: tHome('testimonials.items.3.role'),
                  company: "Kaya İnşaat"
                }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#030712] border border-white/10 relative">
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                  <p className="text-slate-300 mb-8 leading-relaxed italic">"{item.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                      {item.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold">{item.author}</div>
                      <div className="text-sm text-slate-500">{item.role}, {item.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section - Temporarily Disabled
        <section id="pricing" className="py-32 relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{tHome('pricing.title')}</h2>
              <p className="text-slate-400 text-lg mb-8">
                {tHome('pricing.description')}
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
                  {tHome('pricing.monthly')}
                </span>
                <button 
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="w-14 h-8 rounded-full bg-white/10 p-1 relative transition-colors hover:bg-white/20"
                >
                  <div className={`w-6 h-6 rounded-full bg-indigo-500 shadow-lg transition-all ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                  {tHome('pricing.yearly')}
                  <span className="ml-2 text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded-full">
                    {tHome('pricing.save20')}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: tHome('pricing.plans.starter.name'),
                  price: billingCycle === 'monthly' ? "0" : "0",
                  period: billingCycle === 'monthly' ? "/mo" : "/yr",
                  desc: tHome('pricing.plans.starter.desc'),
                  features: [
                    tHome('pricing.plans.starter.features.0'),
                    tHome('pricing.plans.starter.features.1'),
                    tHome('pricing.plans.starter.features.2'),
                    tHome('pricing.plans.starter.features.3'),
                    tHome('pricing.plans.starter.features.4')
                  ],
                  cta: tHome('pricing.plans.starter.cta'),
                  popular: false
                },
                {
                  name: tHome('pricing.plans.pro.name'),
                  price: billingCycle === 'monthly' ? "299" : "2990",
                  period: billingCycle === 'monthly' ? "/mo" : "/yr",
                  desc: tHome('pricing.plans.pro.desc'),
                  features: [
                    tHome('pricing.plans.pro.features.0'),
                    tHome('pricing.plans.pro.features.1'),
                    tHome('pricing.plans.pro.features.2'),
                    tHome('pricing.plans.pro.features.3'),
                    tHome('pricing.plans.pro.features.4')
                  ],
                  cta: tHome('pricing.plans.pro.cta'),
                  popular: true
                },
                {
                  name: tHome('pricing.plans.enterprise.name'),
                  price: tHome('pricing.plans.enterprise.price'),
                  period: "",
                  desc: tHome('pricing.plans.enterprise.desc'),
                  features: [
                    tHome('pricing.plans.enterprise.features.0'),
                    tHome('pricing.plans.enterprise.features.1'),
                    tHome('pricing.plans.enterprise.features.2'),
                    tHome('pricing.plans.enterprise.features.3'),
                    tHome('pricing.plans.enterprise.features.4')
                  ],
                  cta: tHome('pricing.plans.enterprise.cta'),
                  popular: false
                }
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-2xl border ${plan.popular ? 'bg-white/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/5'} flex flex-col`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full shadow-lg">
                      {tHome('pricing.mostPopular')}
                    </div>
                  )}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold">₺{plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {plan.desc}
                    </p>
                  </div>
                  <div className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/register/admin" className="w-full">
                    <Button variant={plan.popular ? 'premium' : 'glass'} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* FAQ Section */}
        <section className="py-32 bg-[#0B0F19] relative">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{tHome('faq.title')}</h2>
              <p className="text-slate-400 text-lg">
                {tHome('faq.description')}
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-white/5 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline text-left">
                    {tHome(`faq.items.${i}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    {tHome(`faq.items.${i}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/10" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 max-w-4xl mx-auto">
              {tHome('cta.titleLine1')} <br />
              <span className="text-indigo-400">{tHome('cta.titleLine2')}</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              {tHome('cta.description')}
            </p>
            <Button asChild className="h-16 px-10 rounded-full bg-white text-black hover:bg-slate-200 text-xl font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
              <Link href="/register/admin">
                {tHome('cta.button')}
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/10 bg-[#0B0F19] text-sm text-slate-500">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Logo className="scale-75 origin-left" />
            </div>
            
            <div className="flex items-center gap-8">
              <Link href="#" className="hover:text-white transition-colors">{tHome('footer.privacy')}</Link>
              <Link href="#" className="hover:text-white transition-colors">{tHome('footer.terms')}</Link>
              <Link href="#" className="hover:text-white transition-colors">{tHome('footer.contact')}</Link>
              <Link href="#" className="hover:text-white transition-colors">{tHome('footer.blog')}</Link>
            </div>

            <div className="flex items-center gap-4">
              {/* <Link href="https://twitter.com/puantajpro" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="https://instagram.com/puantajpro" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="https://linkedin.com/company/puantajpro" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </Link> */}

            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-white/5">
            &copy; {new Date().getFullYear()} Puantaj Pro. {tHome('footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  )
}
