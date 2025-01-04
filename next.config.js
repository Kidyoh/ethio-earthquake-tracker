/** @type {import('next').NextConfig} */
let nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

// Only add PWA if it's installed
try {
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  });
  
  nextConfig = withPWA(nextConfig);
} catch (e) {
  console.warn('Warning: next-pwa is not installed, skipping PWA configuration');
}

module.exports = nextConfig;
