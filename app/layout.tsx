
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import AuthProvider from '@/components/auth-provider';
import { CommandMenu } from '@/components/premium/CommandMenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Puantaj Pro | Yapay Zeka Destekli Personel Yönetimi',
  description: 'Geleceğin çalışma alanı. Personel takibi, vardiya planlama ve maaş hesaplamalarını tek bir modern platformda birleştirin.',
  keywords: ['personel takip', 'puantaj', 'vardiya', 'maaş hesaplama', 'ik yazılımı', 'insan kaynakları'],
  authors: [{ name: 'Puantaj Pro Team' }],
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
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <CommandMenu />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
