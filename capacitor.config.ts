import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.puantajpro.app',
  appName: 'Puantaj Pro',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'https://puantajpro.site'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false,
      backgroundColor: "#030712",
      androidSplashResourceName: "splash",
      iosSplashResourceName: "Default-Portrait_736h",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
