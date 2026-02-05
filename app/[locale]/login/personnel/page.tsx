"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, UserCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { BackgroundGrid } from '@/components/premium/BackgroundGrid';
import PlasmaSphere from '@/components/premium/PlasmaSphere';

export default function PersonnelLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      const res = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Kod gönderilemedi');
      
      setResendSuccess(true);
      setError('');
    } catch (err: any) {
      console.error('Resend error:', err);
      if (err.message?.includes('SMTP')) {
        setError('Sistem Yapılandırma Hatası: Email sunucusu ayarlanmamış.');
      } else {
        setError(err.message || 'Kod gönderilirken bir hata oluştu');
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Geçersiz email veya şifre');
        } else {
          setError(result.error);
        }
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(`Bir hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Effects - Using Blue/Cyan for Personnel to differentiate */}
      <BackgroundGrid fixed />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      <PlasmaSphere />

      <div className="glass-card p-8 md:p-12 rounded-3xl w-full max-w-lg relative z-10 animate-float border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block hover:scale-105 transition-transform mb-6">
            <Logo showText={false} iconClassName="w-24 h-24 rounded-3xl" />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserCircle className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight text-white">Personel Girişi</h1>
          </div>
          <p className="text-slate-400">Çalışan Paneli</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 text-slate-300">Email Adresi</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="personel@sirket.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 text-slate-300">Şifre</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex justify-end">
              <Link 
                href="/forgot-password"
                className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Şifremi Unuttum
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                {error}
              </div>
              {(error.includes('doğrulanmamış') || error.includes('doğrulayın')) && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="text-xs text-blue-400 hover:text-blue-300 underline self-start ml-3.5"
                >
                  {resendLoading ? 'Kod Gönderiliyor...' : 'Doğrulama Kodunu Tekrar Gönder'}
                </button>
              )}
            </div>
          )}

          {resendSuccess && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm flex items-center animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
              Doğrulama kodu email adresinize gönderildi. Lütfen kontrol edin.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center group disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Giriş Yap
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
           <div className="flex flex-col gap-4">
              <Link 
                href="/login"
                className="w-full py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-medium text-center text-slate-300 hover:text-white flex items-center justify-center gap-2 group"
              >
                <Lock className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                Yönetici Girişine Dön
              </Link>
              
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">Hesabınız yok mu?</p>
                <Link 
                  href="/register/personnel"
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Personel Olarak Kaydol
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
