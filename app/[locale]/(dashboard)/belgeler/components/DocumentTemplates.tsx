import React from 'react';
import { Logo } from '@/components/ui/Logo';

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  component: React.FC<any>;
}

const Header = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between border-b-2 border-gray-200 pb-6 mb-8">
    <div className="flex items-center gap-4">
      <Logo showText={true} className="text-gray-900" iconClassName="bg-indigo-600 text-white" />
    </div>
    <div className="text-right">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500 mt-1">Doküman No: {Math.floor(Math.random() * 10000)}</p>
      <p className="text-sm text-gray-500">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
    </div>
  </div>
);

const Footer = () => (
  <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between text-xs text-gray-500">
    <p>Puantaj Pro - Personel Yönetim Sistemleri</p>
    <p>Bu belge elektronik ortamda oluşturulmuştur.</p>
    <p>Sayfa 1 / 1</p>
  </div>
);

export const IzinFormu = () => (
  <div className="bg-white p-8 md:p-12 max-w-4xl mx-auto text-gray-900 font-serif">
    <Header title="PERSONEL İZİN TALEP FORMU" />
    
    <div className="space-y-6">
      <section className="border border-gray-300 rounded-sm">
        <h3 className="bg-gray-100 p-2 font-bold border-b border-gray-300 text-sm uppercase">Personel Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Adı Soyadı</label>
            <div className="border-b border-dotted border-gray-400 h-6"></div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">TC Kimlik No</label>
            <div className="border-b border-dotted border-gray-400 h-6"></div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Departmanı</label>
            <div className="border-b border-dotted border-gray-400 h-6"></div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Görevi</label>
            <div className="border-b border-dotted border-gray-400 h-6"></div>
          </div>
        </div>
      </section>

      <section className="border border-gray-300 rounded-sm">
        <h3 className="bg-gray-100 p-2 font-bold border-b border-gray-300 text-sm uppercase">İzin Detayları</h3>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">İzin Türü</label>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-400"></div> Yıllık İzin</label>
              <label className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-400"></div> Mazeret İzni</label>
              <label className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-400"></div> Hastalık İzni</label>
              <label className="flex items-center gap-2"><div className="w-4 h-4 border border-gray-400"></div> Ücretsiz İzin</label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Başlangıç Tarihi</label>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Bitiş Tarihi</label>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">İşe Başlama Tarihi</label>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">Toplam Gün</label>
              <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">İzin Adresi / İletişim</label>
            <div className="border-b border-dotted border-gray-400 h-6 mt-2"></div>
            <div className="border-b border-dotted border-gray-400 h-6 mt-2"></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-6 pt-4">
        <div className="text-center space-y-8">
          <p className="font-bold text-sm uppercase">Personel İmza</p>
          <div className="h-12"></div>
          <p className="text-xs text-gray-500">Tarih: .../.../......</p>
        </div>
        <div className="text-center space-y-8">
          <p className="font-bold text-sm uppercase">Yönetici Onayı</p>
          <div className="h-12"></div>
          <p className="text-xs text-gray-500">Tarih: .../.../......</p>
        </div>
      </section>
    </div>
    <Footer />
  </div>
);

export const IsSozlesmesi = () => (
  <div className="bg-white p-8 md:p-12 max-w-4xl mx-auto text-gray-900 font-serif text-justify leading-relaxed">
    <Header title="BELİRSİZ SÜRELİ İŞ SÖZLEŞMESİ" />
    
    <div className="space-y-4 text-sm">
      <p>
        <strong>1. TARAFLAR:</strong><br/>
        Bir tarafta <strong>Puantaj Pro Teknoloji A.Ş.</strong> (İşveren) ile diğer tarafta <strong>____________________</strong> (Personel) arasında aşağıdaki şartlarla bir iş sözleşmesi akdedilmiştir.
      </p>

      <p>
        <strong>2. GÖREV TANIMI:</strong><br/>
        Personel, işveren tarafından belirlenen <strong>____________________</strong> unvanı ile çalışacaktır. İşveren, gerekli gördüğü takdirde personelin görev yerini ve tanımını değiştirme hakkını saklı tutar.
      </p>

      <p>
        <strong>3. ÇALIŞMA SÜRESİ:</strong><br/>
        Haftalık çalışma süresi 45 saattir. İşveren, işin gerektirdiği durumlarda yasal sınırlar dahilinde fazla mesai talep edebilir.
      </p>

      <p>
        <strong>4. ÜCRET VE ÖDEME:</strong><br/>
        Personelin aylık brüt ücreti <strong>____________________ TL</strong> olarak belirlenmiştir. Ödemeler her ayın ilk 5 iş günü içerisinde personelin banka hesabına yatırılır.
      </p>

      <p>
        <strong>5. DENEME SÜRESİ:</strong><br/>
        Deneme süresi 2 aydır. Bu süre içinde taraflar sözleşmeyi bildirimsiz ve tazminatsız feshedebilir.
      </p>

      <p>
        <strong>6. GİZLİLİK:</strong><br/>
        Personel, görevi gereği öğrendiği ticari sırları ve şirket bilgilerini, sözleşme sona erse dahi üçüncü şahıslarla paylaşamaz.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-8">
         <div className="text-center">
            <p className="font-bold mb-8">İŞVEREN (KAŞE/İMZA)</p>
            <div className="h-px w-32 bg-gray-400 mx-auto"></div>
         </div>
         <div className="text-center">
            <p className="font-bold mb-8">PERSONEL (İMZA)</p>
            <div className="h-px w-32 bg-gray-400 mx-auto"></div>
         </div>
      </div>
    </div>
    <Footer />
  </div>
);

export const ZimmetTutanagi = () => (
  <div className="bg-white p-8 md:p-12 max-w-4xl mx-auto text-gray-900 font-serif">
    <Header title="ZİMMET TUTANAĞI" />
    
    <div className="space-y-6">
      <p className="text-sm">
        Aşağıda detayları belirtilen demirbaş/ekipman, <strong>Puantaj Pro</strong> tarafından personele, iş amacıyla kullanılmak üzere teslim edilmiştir.
      </p>

      <section className="border border-gray-300 rounded-sm">
        <h3 className="bg-gray-100 p-2 font-bold border-b border-gray-300 text-sm uppercase">Teslim Alan Personel</h3>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Adı Soyadı</label>
            <div className="border-b border-dotted border-gray-400 h-6"></div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Departman</label>
            <div className="border-b border-dotted border-gray-400 h-6"></div>
          </div>
        </div>
      </section>

      <section>
        <table className="w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-100 uppercase text-xs font-bold">
                <tr>
                    <th className="p-3 border border-gray-300">Sıra</th>
                    <th className="p-3 border border-gray-300">Malzeme Adı</th>
                    <th className="p-3 border border-gray-300">Marka / Model</th>
                    <th className="p-3 border border-gray-300">Seri No</th>
                    <th className="p-3 border border-gray-300">Durumu</th>
                </tr>
            </thead>
            <tbody>
                {[1, 2, 3, 4].map((i) => (
                    <tr key={i}>
                        <td className="p-3 border border-gray-300 text-center">{i}</td>
                        <td className="p-3 border border-gray-300"></td>
                        <td className="p-3 border border-gray-300"></td>
                        <td className="p-3 border border-gray-300"></td>
                        <td className="p-3 border border-gray-300"></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </section>

      <div className="text-sm bg-gray-50 p-4 rounded border border-gray-200">
        <p className="font-bold mb-2">Taahhütname:</p>
        <p>
            Teslim aldığım yukarıdaki malzemeleri, şirketin belirlediği kurallar çerçevesinde ve sadece iş amacıyla kullanacağımı,
            kasıtlı veya ihmalim sonucu oluşacak hasarları tazmin edeceğimi, işten ayrılmam durumunda eksiksiz iade edeceğimi kabul ve taahhüt ederim.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
         <div className="text-center">
            <p className="font-bold mb-8">TESLİM EDEN</p>
            <p className="text-xs mb-8 text-gray-500">Adı Soyadı / İmza</p>
            <div className="h-px w-32 bg-gray-400 mx-auto"></div>
         </div>
         <div className="text-center">
            <p className="font-bold mb-8">TESLİM ALAN</p>
            <p className="text-xs mb-8 text-gray-500">Adı Soyadı / İmza</p>
            <div className="h-px w-32 bg-gray-400 mx-auto"></div>
         </div>
      </div>
    </div>
    <Footer />
  </div>
);

export const KVKKMetni = () => (
  <div className="bg-white p-8 md:p-12 max-w-4xl mx-auto text-gray-900 font-serif text-justify leading-relaxed">
    <Header title="KVKK AYDINLATMA METNİ" />
    
    <div className="space-y-4 text-sm">
      <p>
        <strong>Puantaj Pro Teknoloji A.Ş.</strong> olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca,
        Veri Sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan amaçlar ve yöntemlerle işlemekteyiz.
      </p>

      <h3 className="font-bold uppercase text-gray-700 mt-4">1. Kişisel Verilerin İşlenme Amacı</h3>
      <p>
        Kişisel verileriniz; iş sözleşmesinin ifası, yasal yükümlülüklerin yerine getirilmesi, personel özlük dosyasının oluşturulması,
        iş sağlığı ve güvenliği süreçlerinin yürütülmesi ve şirket içi operasyonların yönetilmesi amacıyla işlenmektedir.
      </p>

      <h3 className="font-bold uppercase text-gray-700 mt-4">2. Kişisel Verilerin Aktarılması</h3>
      <p>
        Toplanan kişisel verileriniz; kanunen yetkili kamu kurumlarına (SGK, Vergi Dairesi vb.), hukuki uyuşmazlıkların giderilmesi amacıyla
        adli makamlara ve iş faaliyetlerinin yürütülmesi için gerekli olan iş ortaklarımıza KVKK’nın 8. ve 9. maddelerinde belirtilen şartlar dahilinde aktarılabilir.
      </p>

      <h3 className="font-bold uppercase text-gray-700 mt-4">3. Haklarınız</h3>
      <p>
        KVKK’nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme,
        işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahipsiniz.
      </p>

      <div className="mt-12">
        <p className="mb-8">Yukarıdaki aydınlatma metnini okudum, anladım ve kişisel verilerimin belirtilen amaçlarla işlenmesini kabul ediyorum.</p>
        <div className="grid grid-cols-2 gap-8">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">Tarih</label>
                <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">İmza</label>
                <div className="border-b border-dotted border-gray-400 h-6"></div>
            </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
