"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Save, Loader2, CreditCard, Check, AlertCircle, ExternalLink, Building2, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AyarlarPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    companyName: '',
    taxNumber: '',
    address: '',
    phone: '',
    plan: 'free',
    stripeCurrentPeriodEnd: null as string | null,
    stripeSubscriptionId: null as string | null
  });

  const [iyzicoHtml, setIyzicoHtml] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            role: data.role || 'user',
            companyName: data.companyName || '',
            taxNumber: data.taxNumber || '',
            address: data.address || '',
            phone: data.phone || '',
            plan: data.plan || 'free',
            stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd || null,
            stripeSubscriptionId: data.stripeSubscriptionId || null
          });
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        toast.error("Kullanıcı bilgileri yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUserData();
    }
    
    // Check for payment success/fail URL params
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Ödeme başarıyla tamamlandı! Pro planınız aktif edildi.');
      // Remove param from URL
      window.history.replaceState({}, '', window.location.pathname);
      fetchUserData(); // Refresh data to show Pro status
    } else if (paymentStatus === 'fail') {
      toast.error('Ödeme işlemi başarısız oldu.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [session]);

  const handlePaymentNotification = () => {
    // WhatsApp Link Generation
    const message = `Merhaba, ${formData.email} hesabı için Pro Plan ödemesini Havale/EFT ile gerçekleştirdim. Dekontu bu mesajla birlikte gönderiyorum.`;
    const whatsappUrl = `https://wa.me/905555555555?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleIyzicoPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/iyzico/start', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.htmlContent) {
           setIyzicoHtml(data.htmlContent);
           // Scroll to container
           setTimeout(() => {
             document.getElementById('iyzico-container')?.scrollIntoView({ behavior: 'smooth' });
           }, 100);
        } else {
           toast.error('Ödeme başlatılamadı: ' + (data.message || 'Bilinmeyen hata'));
        }
      } else {
        toast.error('Ödeme servisine erişilemedi');
      }
    } catch (error) {
      console.error(error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (iyzicoHtml) {
      const container = document.getElementById('iyzico-container');
      if (container) {
        // Clear previous content
        container.innerHTML = iyzicoHtml;
        
        // Extract and load script manually because window.load might have passed
        // Iyzico script usually waits for window load
        const srcMatch = iyzicoHtml.match(/script\.src\s*=\s*['"]([^'"]+)['"]/);
        if (srcMatch && srcMatch[1]) {
           const script = document.createElement('script');
           script.src = srcMatch[1];
           script.async = true;
           document.body.appendChild(script);
        } else {
           // Fallback: execute all scripts found (might fail if they wait for load)
           const scripts = container.getElementsByTagName('script');
           for (let i = 0; i < scripts.length; i++) {
              const newScript = document.createElement('script');
              newScript.text = scripts[i].innerHTML;
              document.body.appendChild(newScript);
           }
        }
      }
    }
  }, [iyzicoHtml]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Ayarlar başarıyla kaydedildi");
        // Optionally reload session or update UI
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Kaydetme işlemi başarısız oldu");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinir.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Hesap silinirken bir hata oluştu');
      }

      toast.success('Hesabınız başarıyla silindi');
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.error(error);
      toast.error('Hesap silinemedi. Lütfen tekrar deneyin.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ayarlar" 
        description="Sistem ve hesap yapılandırması"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="company">Şirket</TabsTrigger>
          <TabsTrigger value="billing">Faturalandırma</TabsTrigger>
          <TabsTrigger value="notifications">Bildirim</TabsTrigger>
          <TabsTrigger value="security">Güvenlik</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumCard title="Profil Bilgileri">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${formData.name}&background=random`} />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Fotoğraf Değiştir</Button>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={formData.email} readOnly className="bg-muted" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Rol</Label>
                    <Input id="role" value={formData.role} readOnly className="bg-muted capitalize" />
                  </div>
                </div>

                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Kaydet
                </Button>
              </div>
            </PremiumCard>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <PremiumCard title="Şirket Ayarları">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Şirket Adı</Label>
                  <Input id="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Şirket adı girin" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taxNumber">Vergi Numarası</Label>
                  <Input id="taxNumber" value={formData.taxNumber} onChange={handleInputChange} placeholder="Vergi no girin" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Adres girin" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Telefon girin" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Şirket Bilgilerini Güncelle
                </Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>

        <TabsContent value="billing">
          <PremiumCard title="Plan ve Faturalandırma">
            <div className="grid gap-6">
              {/* Current Plan Status */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Mevcut Plan: <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">{formData.plan}</span>
                    {formData.plan === 'pro' && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-xs border border-indigo-500/20">Aktif</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.plan === 'pro' 
                      ? 'Tüm premium özelliklere erişiminiz var.' 
                      : 'Ücretsiz planı kullanıyorsunuz. Daha fazla özellik için yükseltin.'}
                  </p>
                  {formData.stripeCurrentPeriodEnd && (
                    <p className="text-xs text-muted-foreground pt-1">
                      Yenilenme Tarihi: {new Date(formData.stripeCurrentPeriodEnd).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={() => document.getElementById('havale-section')?.scrollIntoView({ behavior: 'smooth' })}
                  disabled={loading}
                  variant={formData.plan === 'pro' ? "outline" : "default"}
                  className={formData.plan === 'free' ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20" : ""}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    formData.plan === 'pro' ? 'Aboneliği Yönet' : 'Pro Plana Yükselt'
                  )}
                </Button>
              </div>

              {/* Pro Plan Features */}
              {formData.plan === 'free' && (
                <div className="grid gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-500" />
                    Pro Plan Avantajları
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Sınırsız Personel Ekleme',
                      'Gelişmiş Raporlama',
                      'Maaş ve Avans Yönetimi',
                      'Vardiya Planlama',
                      'Öncelikli Destek',
                      'Reklamsız Deneyim'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credit Card Payment */}
              <div className="grid gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-500" />
                  Kredi Kartı ile Güvenli Ödeme
                </h4>
                <p className="text-sm text-muted-foreground">
                  Iyzico altyapısı ile güvenli bir şekilde kredi kartınızla ödeme yapabilirsiniz.
                </p>
                
                {!iyzicoHtml ? (
                   <div className="flex justify-end">
                     <Button onClick={handleIyzicoPayment} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                       {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                       Kredi Kartı ile Öde
                     </Button>
                   </div>
                ) : (
                   <div id="iyzico-container" className="min-h-[400px] w-full bg-white p-4 rounded-lg"></div>
                )}
              </div>

              {/* Bank Transfer Option */}
              <div id="havale-section" className="grid gap-4 p-6 rounded-xl border border-border/50 bg-card/50">
                <h4 className="font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  Havale / EFT ile Ödeme
                </h4>
                <p className="text-sm text-muted-foreground">
                  Kredi kartı kullanmak istemiyorsanız, aşağıdaki banka hesabımıza ödeme yapabilirsiniz. 
                  Ödeme açıklamasında <strong>{formData.email}</strong> belirtmeyi unutmayınız.
                </p>
                <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-2 font-mono border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Banka:</span>
                    <span className="font-semibold">Garanti Bankası</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Alıcı:</span>
                    <span className="font-semibold">Puantaj Pro A.Ş.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">IBAN:</span>
                    <span className="select-all bg-background px-2 py-0.5 rounded border border-border/50">TR12 0006 2000 0001 2345 6789 01</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handlePaymentNotification} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ödeme Yaptım, Bildir (WhatsApp)
                  </Button>
                </div>
              </div>

              {/* Invoice History Placeholder */}
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Fatura Geçmişi</h4>
                <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground bg-muted/20">
                  <AlertCircle className="w-8 h-8 opacity-50" />
                  <p>Henüz bir fatura kaydı bulunmuyor.</p>
                  {formData.plan === 'pro' && (
                    <p className="text-xs">Faturalarınız e-posta adresinize gönderilmektedir.</p>
                  )}
                </div>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>

        <TabsContent value="notifications">
          <PremiumCard title="Bildirim Tercihleri">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-posta Bildirimleri</Label>
                  <p className="text-sm text-muted-foreground">Günlük raporlar ve özetler</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mobil Bildirimler</Label>
                  <p className="text-sm text-muted-foreground">Anlık personel hareketleri</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maaş Ödemeleri</Label>
                  <p className="text-sm text-muted-foreground">Ödeme günü hatırlatmaları</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </PremiumCard>
        </TabsContent>

        <TabsContent value="security">
          <PremiumCard title="Güvenlik Ayarları">
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Mevcut Şifre</Label>
                  <Input type="password" />
                </div>
                <div className="grid gap-2">
                  <Label>Yeni Şifre</Label>
                  <Input type="password" />
                </div>
                <div className="grid gap-2">
                  <Label>Yeni Şifre (Tekrar)</Label>
                  <Input type="password" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label className="text-red-600">Hesabı Sil</Label>
                  <p className="text-sm text-muted-foreground">Bu işlem geri alınamaz</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Siliniyor...
                    </>
                  ) : (
                    'Hesabı Sil'
                  )}
                </Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
      </Tabs>
      {/* Modals removed as we only use Bank Transfer now */}
    </div>
  );
}
