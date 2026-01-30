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
  User, Building, Bell, Shield, Save, 
  Mail, Globe, Lock, CreditCard 
} from 'lucide-react';

export default function AyarlarPage() {
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
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Fotoğraf Değiştir</Button>
                </div>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" defaultValue="Admin User" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="admin@puantaj.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biyografi</Label>
                    <Input id="bio" defaultValue="Sistem Yöneticisi" />
                  </div>
                </div>

                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
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
                  <Label>Şirket Adı</Label>
                  <Input defaultValue="Puantaj Pro A.Ş." />
                </div>
                <div className="grid gap-2">
                  <Label>Vergi Numarası</Label>
                  <Input defaultValue="1234567890" />
                </div>
                <div className="grid gap-2">
                  <Label>Adres</Label>
                  <Input defaultValue="Teknoloji Vadisi, İstanbul" />
                </div>
                <div className="grid gap-2">
                  <Label>Telefon</Label>
                  <Input defaultValue="+90 212 123 45 67" />
                </div>
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Şirket Bilgilerini Güncelle
              </Button>
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
                <Button variant="destructive">Hesabı Sil</Button>
              </div>
            </div>
          </PremiumCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
