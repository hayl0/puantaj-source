
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/auth-provider';
import { CommandMenu } from '@/components/premium/CommandMenu';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VercelToolbar } from '@vercel/toolbar/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Puantaj Pro | Yapay Zeka Destekli Personel Yönetimi',
  description: 'Geleceğin çalışma alanı. Personel takibi, vardiya planlama ve maaş hesaplamalarını tek bir modern platformda birleştirin.',
  keywords: ['personel takip', 'puantaj', 'vardiya', 'maaş hesaplama', 'ik yazılımı', 'insan kaynakları'],
  authors: [{ name: 'Puantaj Pro Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Puantaj Pro',
  },
  openGraph: {
    title: 'Puantaj Pro | Yapay Zeka Destekli Personel Yönetimi',
    description: 'İşletmenizi dijitalleştirin, verimliliği artırın.',
    url: 'https://puantajpro.site',
    siteName: 'Puantaj Pro',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Puantaj Pro',
    description: 'Yapay Zeka Destekli Personel Yönetimi',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <CommandMenu />
            <InstallPrompt />
            <Toaster />
            <SonnerToaster />
            <SpeedInsights />
            <VercelToolbar />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
