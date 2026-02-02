/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev mode
});

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@react-pdf/renderer', 'iyzipay'],
  turbopack: {
    // Turbopack configuration
  },
}

module.exports = withPWA(withNextIntl(nextConfig))
