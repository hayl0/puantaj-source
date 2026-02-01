import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.puantajpro.halil.app.dev',
  appName: 'Puantaj Pro',
  webDir: 'public',
  server: {
    url: 'https://puantajpro.site',
    cleartext: true
  }
};

export default config;
