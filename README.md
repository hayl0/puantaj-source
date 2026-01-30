# 🚀 Puantaj Pro - Ultra Premium Personel Takip Sistemi

**Profesyonel personel takip, puantaj ve finans yönetimi çözümü**

![Puantaj Pro](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC)

## ✨ Özellikler

### 📊 Dashboard
- Gerçek zamanlı istatistikler
- Performans grafikleri
- Hızlı işlem panosu

### 👥 Personel Yönetimi
- Detaylı personel listesi
- Departman bazlı analiz
- Maaş ve pozisyon takibi

### ⏱️ Puantaj Takibi
- Günlük mesai kayıtları
- Devamsızlık takibi
- Otomatik raporlama

### 📈 Raporlama
- PDF/Excel çıktıları
- Özelleştirilmiş raporlar
- Otomatik planlama

### 💰 Finans Yönetimi
- Maaş bordrosu
- Gelir-gider takibi
- Vergi analizleri

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS + Shadcn/UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Auth**: NextAuth.js
- **Database**: Prisma + PostgreSQL
- **Deployment**: Vercel

## 🚀 Deployment

### Vercel (Önerilen)
1. Repo'yu Vercel'e import edin
2. Environment variables ekleyin:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
3. Deploy'a tıklayın

### Environment Variables
\`\`\`bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=$(openssl rand -base64 32)
\`\`\`

## 📁 Proje Yapısı

\`\`\`
puantaj-source/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard sayfası
│   ├── personel/          # Personel yönetimi
│   ├── puantaj/           # Puantaj takibi
│   └── raporlar/          # Raporlama
├── components/            # React bileşenleri
│   ├── ui/               # Shadcn/UI bileşenleri
│   └── premium/          # Premium özel bileşenler
├── lib/                   # Utilities
└── prisma/               # Database şeması
\`\`\`

## 🎯 Demo Bilgileri

**Demo Giriş:**
- Email: \`admin@puantaj.com\`
- Password: \`admin123\`

## 📞 İletişim

Proje ile ilgili sorularınız için:
- **GitHub Issues**: [Issues](https://github.com/your-repo/issues)
- **Email**: contact@puantaj.com

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.
