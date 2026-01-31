
import { BackgroundGrid } from '@/components/premium/BackgroundGrid';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#030712] text-white py-20 px-4 relative overflow-hidden">
      <BackgroundGrid fixed />
      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-indigo-500">Kullanım Şartları</h1>
        
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <p>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Kabul Edilme</h2>
            <p>
              Puantaj Pro web sitesini ve hizmetlerini kullanarak, bu kullanım şartlarını kabul etmiş sayılırsınız. 
              Eğer bu şartları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Hizmet Kullanımı</h2>
            <p>
              Hizmetlerimizi sadece yasal amaçlar için kullanmayı kabul edersiniz. Aşağıdaki eylemler yasaktır:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Sistemin güvenliğini ihlal etmeye çalışmak</li>
              <li>Başkalarının hesaplarına yetkisiz erişim sağlamak</li>
              <li>Sisteme zarar verebilecek virüs veya kod yüklemek</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Hesap Güvenliği</h2>
            <p>
              Hesap bilgilerinizin (kullanıcı adı ve şifre) güvenliğinden siz sorumlusunuz. 
              Şifrenizin izinsiz kullanıldığını fark ederseniz hemen bize bildirmelisiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Fikri Mülkiyet</h2>
            <p>
              Puantaj Pro'nun tüm içeriği, tasarımı ve kodları şirketimize aittir ve telif hakkı yasaları ile korunmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Değişiklikler</h2>
            <p>
              Bu kullanım şartlarını dilediğimiz zaman değiştirme hakkını saklı tutarız. 
              Değişiklikler web sitesinde yayınlandığı andan itibaren geçerli olur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. İletişim</h2>
            <p>
              Sorularınız için: destek@puantajpro.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
