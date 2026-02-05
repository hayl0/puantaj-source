'use client';

import { useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Hide splash screen after a small delay to ensure content is painted
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 500);
    }
  }, []);

  return <>{children}</>;
}
