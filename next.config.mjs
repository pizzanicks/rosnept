// next.config.mjs

// Import the default export (the i18n configuration object) from your next-i18next.config.mjs
// This path is relative to the current next.config.mjs file.
import nextI18NextConfig from './next-i18next.config.mjs'; // <--- CRITICAL IMPORT

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables React's Strict Mode, which helps you find potential problems in your components.
  reactStrictMode: true,
  // --- START ADDED/UPDATED CODE ---
  // This is where the internationalization configuration is applied to your Next.js application.
  // We're directly assigning the 'i18n' property from the imported nextI18NextConfig.
  i18n: nextI18NextConfig.i18n, // <--- THIS IS THE KEY LINE FOR i18n INTEGRATION
  // --- END ADDED/UPDATED CODE ---

  // Add any other existing Next.js configurations here if you have them,
  // e.g., images, webpack, env, etc.
  // images: {
  //   domains: ['example.com'],
  // },
};

// Export the final Next.js configuration object.
export default nextConfig;
