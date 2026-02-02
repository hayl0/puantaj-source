"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Save, Loader2, CreditCard, Check, AlertCircle, ExternalLink, 
  Building2, MessageCircle, User, Bell, Shield, Palette, LogOut,
  ChevronRight, Camera, Smartphone, Mail, Lock, Download
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

type SettingsTab = 'profile' | 'company' | 'billing' | 'notifications' | 'security' | 'appearance';

export default function AyarlarPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      window.history.replaceState({}, '', window.location.pathname);
      fetchUserData();
    } else if (paymentStatus === 'fail') {
      toast.error('Ödeme işlemi başarısız oldu.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [session]);

  const handlePaymentNotification = () => {
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
        container.innerHTML = iyzicoHtml;
        const srcMatch = iyzicoHtml.match(/script\.src\s*=\s*['"]([^'"]+)['"]/);
        if (srcMatch && srcMatch[1]) {
           const script = document.createElement('script');
           script.src = srcMatch[1];
           script.async = true;
           document.body.appendChild(script);
        } else {
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

  const handlePhotoUpload = () => {
    // Trigger hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to storage (AWS S3, etc.)
      // For now, we'll just show a success message
      toast.success("Profil fotoğrafı yüklendi (Demo)");
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profil Bilgileri', icon: User, description: 'Kişisel bilgilerinizi yönetin' },
    { id: 'company', label: 'Şirket Ayarları', icon: Building2, description: 'Şirket ve vergi bilgileri' },
    { id: 'billing', label: 'Plan ve Fatura', icon: CreditCard, description: 'Abonelik ve ödemeler' },
    { id: 'notifications', label: 'Bildirimler', icon: Bell, description: 'E-posta ve bildirim tercihleri' },
    { id: 'security', label: 'Güvenlik', icon: Shield, description: 'Şifre ve hesap güvenliği' },
    { id: 'appearance', label: 'Görünüm', icon: Palette, description: 'Tema ve arayüz ayarları' },
  ];

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Ayarlar" 
        description="Hesap tercihlerinizi ve sistem yapılandırmasını yönetin"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-72 shrink-0 space-y-4">
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden bg-background/50 backdrop-blur-xl">
                <div className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as SettingsTab)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                                activeTab === item.id 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                    : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            <div className="flex-1 text-left">
                                <div>{item.label}</div>
                            </div>
                            {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Account Summary Card */}
            <div className="glass-card rounded-2xl border border-white/10 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${formData.name}&background=random`} />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="font-medium truncate">{formData.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{formData.email}</p>
                    </div>
                </div>
                <div className="text-xs text-center p-2 rounded-lg bg-background/50 border border-white/5">
                    <span className="text-muted-foreground">Mevcut Plan: </span>
                    <span className="font-bold uppercase text-primary">{formData.plan}</span>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <PremiumCard title="Profil Fotoğrafı" className="overflow-visible">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="relative group cursor-pointer" onClick={handlePhotoUpload}>
                                        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-2xl transition-transform group-hover:scale-105">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${formData.name}&background=random`} />
                                            <AvatarFallback className="text-2xl">AD</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="text-center md:text-left space-y-2">
                                        <h3 className="font-semibold text-lg">Profil Fotoğrafınızı Güncelleyin</h3>
                                        <p className="text-sm text-muted-foreground max-w-sm">
                                            Kişisel markanızı yansıtmak için profesyonel bir fotoğraf yükleyin. 
                                            JPG, PNG veya GIF (maks. 2MB).
                                        </p>
                                        <Button variant="outline" size="sm" onClick={handlePhotoUpload}>
                                            <Camera className="w-4 h-4 mr-2" />
                                            Fotoğraf Yükle
                                        </Button>
                                    </div>
                                </div>
                            </PremiumCard>

                            <PremiumCard title="Kişisel Bilgiler">
                                <div className="grid gap-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Ad Soyad</Label>
                                            <Input id="name" value={formData.name} onChange={handleInputChange} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">E-posta Adresi</Label>
                                            <div className="relative">
                                                <Input id="email" value={formData.email} readOnly className="bg-muted pl-10" />
                                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="role">Rol</Label>
                                            <Input id="role" value={formData.role} readOnly className="bg-muted capitalize" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Telefon Numarası</Label>
                                            <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+90 555 ..." />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end pt-4">
                                        <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
                                            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                            Değişiklikleri Kaydet
                                        </Button>
                                    </div>
                                </div>
                            </PremiumCard>
                        </div>
                    )}

                    {activeTab === 'company' && (
                        <PremiumCard title="Şirket Bilgileri">
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
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="address">Adres</Label>
                                        <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Tam adres girin" />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} disabled={saving}>
                                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Şirket Bilgilerini Güncelle
                                    </Button>
                                </div>
                            </div>
                        </PremiumCard>
                    )}

                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <PremiumCard title="Plan Durumu">
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
                                                ? 'Tüm premium özelliklere sınırsız erişiminiz var.' 
                                                : 'Şu anda Ücretsiz plandasınız. İşletmenizi büyütmek için Pro\'ya geçin.'}
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => document.getElementById('payment-methods')?.scrollIntoView({ behavior: 'smooth' })}
                                        className={cn(
                                            "shadow-lg",
                                            formData.plan === 'free' && "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                        )}
                                        variant={formData.plan === 'pro' ? 'outline' : 'default'}
                                    >
                                        {formData.plan === 'pro' ? 'Planı Yönet' : 'Pro\'ya Yükselt'}
                                    </Button>
                                </div>
                            </PremiumCard>
                            
                            <div id="payment-methods" className="grid gap-6">
                                <PremiumCard title="Ödeme Yöntemleri">
                                    <Tabs defaultValue="credit-card" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 mb-6">
                                            <TabsTrigger value="credit-card">Kredi Kartı</TabsTrigger>
                                            <TabsTrigger value="transfer">Havale / EFT</TabsTrigger>
                                        </TabsList>
                                        
                                        <TabsContent value="credit-card" className="space-y-4">
                                            <div className="p-4 rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 text-center space-y-4">
                                                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">Güvenli Ödeme</h4>
                                                    <p className="text-sm text-muted-foreground">Iyzico altyapısı ile 256-bit SSL korumalı ödeme</p>
                                                </div>
                                                {!iyzicoHtml ? (
                                                    <Button onClick={handleIyzicoPayment} disabled={loading} className="w-full md:w-auto">
                                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                                                        Ödeme Yap
                                                    </Button>
                                                ) : (
                                                    <div id="iyzico-container" className="min-h-[400px] w-full bg-white p-4 rounded-lg text-left"></div>
                                                )}
                                            </div>
                                        </TabsContent>
                                        
                                        <TabsContent value="transfer" className="space-y-4">
                                            <div className="p-6 rounded-xl border border-border bg-muted/10 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-5 h-5 text-orange-500" />
                                                    <h4 className="font-medium">Banka Hesap Bilgileri</h4>
                                                </div>
                                                <div className="grid gap-2 text-sm font-mono bg-background p-4 rounded-lg border">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Banka:</span>
                                                        <span>Garanti Bankası</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Alıcı:</span>
                                                        <span>Puantaj Pro A.Ş.</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">IBAN:</span>
                                                        <span className="select-all">TR12 0006 2000 0001 2345 6789 01</span>
                                                    </div>
                                                </div>
                                                <Button onClick={handlePaymentNotification} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    WhatsApp ile Dekont Gönder
                                                </Button>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </PremiumCard>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <PremiumCard title="Bildirim Tercihleri">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <Label className="text-base">E-posta Bildirimleri</Label>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Günlük raporlar ve önemli güncellemeler</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <Smartphone className="w-4 h-4 text-primary" />
                                            <Label className="text-base">Mobil Bildirimler</Label>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Anlık personel hareketleri ve uyarılar</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button onClick={() => toast.success("Bildirim tercihleri güncellendi")}>
                                        <Save className="w-4 h-4 mr-2" />
                                        Tercihleri Kaydet
                                    </Button>
                                </div>
                            </div>
                        </PremiumCard>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <PremiumCard title="Şifre Değiştir">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current-password">Mevcut Şifre</Label>
                                        <div className="relative">
                                            <Input id="current-password" type="password" />
                                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="new-password">Yeni Şifre</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="confirm-password">Yeni Şifre (Tekrar)</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button onClick={() => toast.success("Şifreniz başarıyla güncellendi")}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Şifreyi Güncelle
                                        </Button>
                                    </div>
                                </div>
                            </PremiumCard>

                            <PremiumCard title="Veri ve Gizlilik">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-medium">Verilerimi İndir</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Hesabınıza ait tüm verilerin bir kopyasını (JSON formatında) indirin.
                                        </p>
                                    </div>
                                    <Button variant="outline" onClick={() => toast.success("Verileriniz hazırlanıyor. Hazır olduğunda e-posta ile gönderilecektir.")}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Talep Et
                                    </Button>
                                </div>
                            </PremiumCard>

                            <PremiumCard title="Tehlikeli Bölge" className="border-red-500/20 bg-red-500/5">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="font-medium text-red-600">Hesabı Sil</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Hesabınızı ve tüm verilerinizi kalıcı olarak siler. Bu işlem geri alınamaz.
                                        </p>
                                    </div>
                                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                                        {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                                        Hesabı Sil
                                    </Button>
                                </div>
                            </PremiumCard>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <PremiumCard title="Görünüm Ayarları">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-base">Tema Seçimi</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <button 
                                            onClick={() => setTheme("light")}
                                            className={cn(
                                                "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                                theme === "light" ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50 hover:bg-secondary"
                                            )}
                                        >
                                            <div className="w-full h-20 rounded-lg bg-[#f0f0f0] border border-gray-200 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 right-0 h-4 bg-white border-b"></div>
                                                <div className="absolute top-6 left-2 w-16 h-8 bg-white rounded shadow-sm"></div>
                                            </div>
                                            <span className="font-medium text-sm">Aydınlık</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => setTheme("dark")}
                                            className={cn(
                                                "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                                theme === "dark" ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50 hover:bg-secondary"
                                            )}
                                        >
                                            <div className="w-full h-20 rounded-lg bg-[#1a1a1a] border border-gray-800 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 right-0 h-4 bg-[#2a2a2a] border-b border-gray-800"></div>
                                                <div className="absolute top-6 left-2 w-16 h-8 bg-[#2a2a2a] rounded shadow-sm"></div>
                                            </div>
                                            <span className="font-medium text-sm">Karanlık</span>
                                        </button>

                                        <button 
                                            onClick={() => setTheme("system")}
                                            className={cn(
                                                "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                                theme === "system" ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50 hover:bg-secondary"
                                            )}
                                        >
                                            <div className="w-full h-20 rounded-lg bg-gradient-to-br from-[#f0f0f0] to-[#1a1a1a] border border-gray-500/20 shadow-sm relative overflow-hidden">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Smartphone className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <span className="font-medium text-sm">Sistem</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
