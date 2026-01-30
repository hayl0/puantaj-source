"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Building, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating registration delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Kayıt Başarılı",
      description: "Hesabınız oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...",
    });

    setLoading(false);
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background order-2 lg:order-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm space-y-8"
        >
          <div className="space-y-2 text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Image 
                src="/logo.svg" 
                alt="Puantaj Pro Logo" 
                fill 
                className="object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Hesap Oluştur</h1>
            <p className="text-muted-foreground">Puantaj Pro dünyasına katılın</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Adınız Soyadınız" 
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Şirket Adı</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="company" 
                  type="text" 
                  placeholder="Şirketiniz (Opsiyonel)" 
                  className="pl-10"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Adresi</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="ornek@sirket.com" 
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-11" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Kaydediliyor...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Kayıt Ol</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Giriş Yap
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-muted/30 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl" />
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20" />
            <div className="bg-card border rounded-2xl p-8 shadow-2xl relative">
              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: "Sınırsız Personel Ekleme", color: "text-green-500" },
                  { icon: CheckCircle, text: "Otomatik Maaş Hesaplama", color: "text-blue-500" },
                  { icon: CheckCircle, text: "Gelişmiş Raporlama", color: "text-purple-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">İşletmenizi Profesyonelce Yönetin</h2>
            <p className="text-muted-foreground text-lg">
              Binlerce işletmenin tercih ettiği Puantaj Pro ile personel takibi artık çok kolay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
