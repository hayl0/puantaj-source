
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle, Users, Target, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakkımızda | Puantaj Pro',
  description: 'Puantaj Pro ekibi ve misyonumuz hakkında bilgi edinin.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-indigo-500/10 opacity-30 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white pl-0 gap-2">
              <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            Hakkımızda
          </h1>
          
          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            Puantaj Pro, işletmelerin personel yönetimi süreçlerini dijitalleştirmek ve modernleştirmek amacıyla 2024 yılında kurulmuştur.
            Karmaşık Excel tablolarından ve manuel süreçlerden kurtulmanızı sağlayarak, işinize odaklanmanıza yardımcı oluyoruz.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Misyonumuz</h3>
              <p className="text-slate-400">İşletmelerin dijital dönüşümünü hızlandırmak ve verimliliği artırmak.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Güvenlik</h3>
              <p className="text-slate-400">Verilerinizi en son teknolojilerle ve KVKK standartlarına uygun olarak koruyoruz.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ekibimiz</h3>
              <p className="text-slate-400">Alanında uzman yazılımcılar ve İK profesyonellerinden oluşan güçlü bir ekip.</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">Neden Puantaj Pro?</h2>
            <p className="text-slate-400 mb-4">
              Geleneksel personel takip yöntemleri günümüzün hızlı iş dünyasında yetersiz kalıyor. 
              Biz, yapay zeka destekli teknolojilerimizle süreçleri otomatize ediyor, hata payını sıfıra indiriyoruz.
            </p>
            <ul className="space-y-3 mt-6">
              {[
                'Kullanıcı dostu modern arayüz',
                '7/24 Teknik destek',
                'Sürekli güncellenen altyapı',
                'Bulut tabanlı güvenli sistem'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
