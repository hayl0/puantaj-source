
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/auth-provider';
import { CommandMenu } from '@/components/premium/CommandMenu';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VercelToolbar } from '@vercel/toolbar/next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SplashScreen } from '@capacitor/splash-screen';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://puantajpro.site';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: '%s | Puantaj Pro',
      default: 'Puantaj Pro | Yapay Zeka Destekli Personel Yönetimi',
    },
    description: 'Geleceğin çalışma alanı. Personel takibi, vardiya planlama ve maaş hesaplamalarını tek bir modern platformda birleştirin.',
    keywords: ['personel takip', 'puantaj', 'vardiya', 'maaş hesaplama', 'ik yazılımı', 'insan kaynakları'],
    authors: [{ name: 'Puantaj Pro Team' }],
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Puantaj Pro',
    },
    openGraph: {
      title: 'Puantaj Pro | Yapay Zeka Destekli Personel Yönetimi',
      description: 'İşletmenizi dijitalleştirin, verimliliği artırın.',
      url: `${baseUrl}/${locale}`,
      siteName: 'Puantaj Pro',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US', // Basic mapping, can be improved
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Puantaj Pro',
      description: 'Yapay Zeka Destekli Personel Yönetimi',
    },
    verification: {
      google: 'pWbzR_jYvQnIg33y_9-lziKnrWjTKdJSRwsdaaqZSac',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'tr': `${baseUrl}/tr`,
        'en': `${baseUrl}/en`,
        'de': `${baseUrl}/de`,
        // Add other languages if needed
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Puantaj Pro',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
    },
    description: 'Yapay Zeka Destekli Personel Yönetimi ve Puantaj Sistemi',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '124'
    }
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <ClientLayout>
                <div className="min-h-screen bg-background">
                  {children}
                </div>
                <CommandMenu />
                <InstallPrompt />
                <Toaster />
                <SonnerToaster />
                <SpeedInsights scriptSrc="https://va.vercel-scripts.com/v1/speed-insights/script.debug.js" />
              </ClientLayout>
              {/* <VercelToolbar /> - Disabled for production */}
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
