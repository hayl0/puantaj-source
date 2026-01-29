import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Puantaj Pro - İş Takip Sistemi",
  description: "Profesyonel personel, puantaj ve finans takip sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-800 dark:border-gray-700">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg"></div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    Puantaj Pro
                  </h1>
                </div>
                
                <div className="flex items-center gap-4">
                  <NotificationBell />
                  <ThemeToggle />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Giriş Yap
                  </button>
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
