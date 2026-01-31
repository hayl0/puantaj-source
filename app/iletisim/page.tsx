
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Mail, MapPin, Phone, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İletişim | Puantaj Pro',
  description: 'Bizimle iletişime geçin. Destek, satış ve diğer konular için buradayız.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-violet-500/10 opacity-30 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white pl-0 gap-2">
              <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                İletişime Geçin
              </h1>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Sorularınız mı var? Ekibimiz size yardımcı olmaktan mutluluk duyar. 
                Formu doldurun veya aşağıdaki kanallardan bize ulaşın.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">E-posta</h3>
                    <p className="text-slate-400">info@puantajpro.site</p>
                    <p className="text-slate-500 text-sm">7/24 destek alabilirsiniz.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Telefon</h3>
                    <p className="text-slate-400">+90 (850) 123 45 67</p>
                    <p className="text-slate-500 text-sm">Hafta içi 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Ofis</h3>
                    <p className="text-slate-400">Teknoloji Vadisi, B Blok No:42</p>
                    <p className="text-slate-400">İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6">Mesaj Gönderin</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-300">Adınız</label>
                    <Input id="name" placeholder="Adınız" className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="surname" className="text-sm font-medium text-slate-300">Soyadınız</label>
                    <Input id="surname" placeholder="Soyadınız" className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">E-posta Adresi</label>
                  <Input id="email" type="email" placeholder="ornek@sirket.com" className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-300">Mesajınız</label>
                  <Textarea id="message" placeholder="Size nasıl yardımcı olabiliriz?" className="min-h-[120px] bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500" />
                </div>

                <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all hover:scale-[1.02]">
                  <Send className="w-4 h-4 mr-2" /> Mesajı Gönder
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
