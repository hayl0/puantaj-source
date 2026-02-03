
import { PageHeader } from '@/components/premium/PageHeader';
import { BackgroundGrid } from '@/components/premium/BackgroundGrid';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#030712] text-white py-20 px-4 relative overflow-hidden">
      <BackgroundGrid fixed />
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-indigo-500">Gizlilik Politikası</h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Giriş</h2>
            <p>
              Puantaj Pro ("Şirket", "biz", "bize" veya "bizim") olarak gizliliğinize önem veriyoruz. 
              Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi kullandığınızda bilgilerinizin nasıl toplandığını, 
              kullanıldığını ve paylaşıldığını açıklar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Toplanan Bilgiler</h2>
            <p>
              Hizmetlerimizi kullanırken aşağıdaki bilgileri toplayabiliriz:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Kişisel Kimlik Bilgileri (Ad, soyad, e-posta adresi, telefon numarası)</li>
              <li>Kurumsal Bilgiler (Şirket adı, departman bilgileri)</li>
              <li>Kullanım Verileri (Giriş saatleri, IP adresi, tarayıcı türü)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Bilgilerin Kullanımı</h2>
            <p>
              Topladığımız bilgileri şu amaçlarla kullanırız:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Hizmetlerimizi sağlamak ve sürdürmek</li>
              <li>Hesabınızı yönetmek</li>
              <li>Sizinle iletişime geçmek</li>
              <li>Hizmet kalitesini artırmak</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Veri Güvenliği</h2>
            <p>
              Verilerinizin güvenliği bizim için önemlidir. Endüstri standardı güvenlik önlemleri ve şifreleme teknolojileri kullanarak 
              bilgilerinizi korumaya çalışıyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. İletişim</h2>
            <p>
              Bu gizlilik politikası hakkında sorularınız varsa, lütfen bizimle iletişime geçin: destek@puantajpro.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
