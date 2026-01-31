
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Building, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Bir hata oluştu');
      }

      if (data.needsVerification) {
        setStep('verify');
      } else {
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, type: 'admin' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Doğrulama başarısız');
      }

      router.push('/login?verified=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white relative overflow-hidden selection:bg-indigo-500/30">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        </div>

        <div className="glass-card p-8 md:p-12 rounded-3xl w-full max-w-lg relative z-10 animate-float border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="mb-8 text-center">
             <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-indigo-400" />
             </div>
             <h2 className="text-2xl font-bold mb-2">Email Doğrulama</h2>
             <p className="text-slate-400">
               <span className="text-white font-medium">{email}</span> adresine gönderdiğimiz 6 haneli kodu giriniz.
             </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1 text-slate-300">Doğrulama Kodu</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono py-4 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="000000"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Doğrula ve Giriş Yap
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('register')}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Geri Dön
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Grid & Spotlights */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] bg-blue-500/10 opacity-30 blur-[100px]" />
      </div>

      <div className="glass-card p-8 md:p-12 rounded-3xl w-full max-w-lg relative z-10 animate-float border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mb-8">
          <Link href="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Giriş'e Dön
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Building className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Yönetici Kaydı</h1>
          </div>
          <p className="text-slate-400">Şirketiniz için yeni bir hesap oluşturun.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 text-slate-300">Ad Soyad / Şirket Adı</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="Örn: Halil Yılmaz"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 text-slate-300">Email Adresi</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="admin@sirket.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1 text-slate-300">Şifre</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center animate-in fade-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center group disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Hesap Oluştur
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
