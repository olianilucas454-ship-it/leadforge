import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.leadforge.app',
  appName: 'LeadForge',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    cleartext: true,
    // When testing native app against local server or deployed URL:
    url: process.env.CAPACITOR_SERVER_URL || 'http://localhost:3001',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#090A0F',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
};

export default config;
