"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Giriş Başarısız",
          description: "E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Giriş yapıldı, yönlendiriliyorsunuz...",
        });
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bir bağlantı hatası oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
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
            <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz</h1>
            <p className="text-muted-foreground">Hesabınıza giriş yaparak devam edin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Button variant="link" className="p-0 h-auto text-xs">Şifremi Unuttum</Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-11" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Giriş Yap <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Demo Hesaplar
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" onClick={() => {setEmail('admin@puantaj.com'); setPassword('admin123')}}>
              Admin Girişi
            </Button>
            <Button variant="outline" type="button" onClick={() => {setEmail('user@puantaj.com'); setPassword('demo123')}}>
              Personel Girişi
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Hesabınız yok mu? </span>
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Kayıt Ol
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-col justify-center p-12 relative bg-muted text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-800" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
        
        <div className="relative z-10 max-w-lg mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4">İş Gücünüzü Yönetmenin En Modern Yolu</h2>
            <p className="text-primary-foreground/80 text-lg">
              Personel takibi, maaş yönetimi ve performans analizleri artık tek bir platformda.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {[
              'Otomatik Puantaj Takibi',
              'Gelişmiş Maaş Hesaplama',
              'Detaylı Raporlama',
              'Mobil Uyumlu Arayüz'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="pt-8"
          >
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <p className="italic text-sm mb-4">
                "Puantaj Pro sayesinde IK süreçlerimizi %60 hızlandırdık. Kesinlikle harika bir deneyim."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div>
                  <p className="font-bold text-sm">Elif Yılmaz</p>
                  <p className="text-xs text-primary-foreground/60">İK Direktörü, TechCorp</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
