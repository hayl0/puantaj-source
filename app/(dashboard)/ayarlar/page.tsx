"use client";

import { PageHeader } from '@/components/premium/PageHeader';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Save, Loader2
} from 'lucide-react';
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
    phone: ''
  });

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
            phone: data.phone || ''
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
  }, [session]);

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
    </div>
  );
}
