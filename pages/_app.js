// pages/_app.js
import "@/styles/globals.css"; // Your global styles
import { FirebaseProvider } from "@/lib/firebaseContext"; // Your existing Firebase Provider

// --- NEW IMPORTS FOR NEXT-I18NEXT ---
import { appWithTranslation } from 'next-i18next'; // Import appWithTranslation HOC
// --- REMOVED: import nextI18NextConfig from '../next-i18next.config.mjs'; ---
// You DO NOT need to import nextI18NextConfig directly here.
// next-i18next will automatically pick up the config via next.config.mjs
// --- END NEW IMPORTS ---

function MyApp({ Component, pageProps }) {
  return (
    // Wrap the FirebaseProvider inside appWithTranslation
    // This ensures that all components, including those using Firebase, also have access to translation.
    <FirebaseProvider>
      <Component {...pageProps} />
    </FirebaseProvider>
  );
}

// Wrap your main application component (`MyApp`) with `appWithTranslation`.
// IMPORTANT: DO NOT pass nextI18NextConfig as a second argument here.
// It should now simply be `appWithTranslation(MyApp)`.
export default appWithTranslation(MyApp);
