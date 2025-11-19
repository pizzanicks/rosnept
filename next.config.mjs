import nextI18NextConfig from './next-i18next.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: nextI18NextConfig.i18n,
  images: {
    domains: ['fra.cloud.appwrite.io', 'localhost'],
  },
};

export default nextConfig;
