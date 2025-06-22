// next-i18next.config.mjs
// This file uses ES Module syntax (import/export).

// Required for resolving file paths in an ES module environment (equivalent to __dirname).
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define your i18n configuration object.
// IMPORTANT: 'localePath', 'debug', 'saveMissing' are direct properties of i18nConfig,
// NOT nested inside the 'i18n' object that Next.js expects directly.
const i18nConfig = {
  // This 'i18n' object directly maps to what Next.js expects in its next.config.mjs file.
  // It should only contain 'locales' and 'defaultLocale' (and optionally 'domains').
  i18n: {
    locales: ['en', 'fr', 'ru', 'nl', 'es', 'de', 'pt'], // Your supported languages
    defaultLocale: 'en', // The default language for your application
  },

  // These are specific configurations for 'next-i18next' itself,
  // and are *not* passed directly into Next.js's native i18n object.
  // They are used by the `appWithTranslation` and `serverSideTranslations` functions.
  localePath: resolve(__dirname, './public/locales'), // Path to your translation files
  // debug: process.env.NODE_ENV === 'development', // Uncomment to enable i18n debugging in development
  // saveMissing: true, // Uncomment to automatically add missing keys to your default locale file
};

// Export the configuration using ES module syntax.
export default i18nConfig;
