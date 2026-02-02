import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.puantajpro.app',
  appName: 'Puantaj Pro',
  webDir: 'public',
  server: {
    url: 'https://puantajpro.site',
    cleartext: true
  }
};

export default config;
