// next-i18next.config.mjs
// This file uses ES Module syntax (import/export).

// Required for resolving file paths in an ES module environment (equivalent to __dirname).
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module file.
// If this file is in your project root, __dirname will be your project root.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your i18n configuration object.
const i18nConfig = {
  // This 'i18n' object directly maps to what Next.js expects in its next.config.mjs file.
  // It should only contain 'locales' and 'defaultLocale' (and optionally 'domains').
  i18n: {
    locales: ['en', 'fr', 'ru', 'nl', 'es', 'de', 'pt'], // Your supported languages
    defaultLocale: 'en', // The default language for your application
  },

  // These are specific configurations for 'next-i18next' itself.
  // They tell 'next-i18next' where to find your translation files on the server.
  // This path must be relative to your project's root.
  // Since __dirname here is the project root, we can directly append 'public/locales'.
  localePath: resolve(__dirname, 'public/locales'), // Corrected path!

  // Optional: Uncomment these for debugging and automatic missing key saving
  // debug: process.env.NODE_ENV === 'development', // Enable i18n debugging in development
  // saveMissing: true, // Automatically add missing keys to your default locale file (e.g., en/common.json)
};

// Export the configuration using ES module syntax.
export default i18nConfig;