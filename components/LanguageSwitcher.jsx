// components/LanguageSwitcher.jsx
'use client'; // This directive indicates that this component should be rendered on the client side.

import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // Icon for the dropdown arrow
import { useRouter } from 'next/router'; // Next.js hook for client-side navigation
import { useTranslation } from 'next-i18next'; // Hook from next-i18next to access i18n functionalities

// Define the list of languages your application supports.
// Each object contains:
// - `name`: The full name of the language (for display in the dropdown).
// - `code`: The language code, which MUST match the locales defined in next-i18next.config.mjs
//           and the names of your locale folders (e.g., 'en', 'fr').
// - `flag`: A Unicode flag emoji for visual representation.
const LANGUAGES = [
  { name: 'English', code: 'en', flag: '🇬🇧' },
  { name: 'French', code: 'fr', flag: '🇫🇷' },
  { name: 'Russian', code: 'ru', flag: '🇷🇺' },
  { name: 'Dutch', code: 'nl', flag: '🇳🇱' },
  { name: 'Spanish', code: 'es', flag: '🇪🇸' },
  { name: 'German', code: 'de', flag: '🇩🇪' },
  { name: 'Portuguese', code: 'pt', flag: '🇵🇹' },
];

const LanguageSwitcher = () => {
  const router = useRouter(); // Initialize Next.js router for changing locales.
  const { i18n } = useTranslation(); // Get the i18n instance from the useTranslation hook. This instance holds the current language.

  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control the visibility of the dropdown menu.
  const dropdownRef = useRef(null); // Ref to attach to the dropdown container to detect clicks outside.

  // Determine the currently active language and its corresponding flag emoji.
  // `i18n.language` provides the current locale (e.g., 'en', 'fr') set by next-i18next.
  const currentLocale = i18n.language;
  // Find the language object in our LANGUAGES array that matches the current locale.
  // Fallback to the first language (English) if the current locale isn't found in our defined list.
  const activeLang = LANGUAGES.find(lang => lang.code === currentLocale) || LANGUAGES[0];

  // Effect hook to handle closing the dropdown when a click occurs anywhere outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown is open and the click is outside the dropdown's ref element, close it.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    // Attach the event listener when the component mounts.
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup function: remove the event listener when the component unmounts to prevent memory leaks.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  // Function to change the application's language.
  const changeLanguage = (langCode) => {
    // Next.js's router.push is used to change the URL's locale segment.
    // `pathname`, `asPath`, and `query` are extracted from the current router state.
    // The `locale: langCode` option tells Next.js to update the URL with the new language prefix (e.g., /en -> /fr).
    // This will trigger a re-render of the page with the newly loaded translations.
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: langCode });
    setDropdownOpen(false); // Close the dropdown menu after a language is selected.
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* The main button that triggers the language dropdown. */}
      {/* It displays the flag of the currently active language and a dropdown arrow. */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)} // Toggles the dropdown's visibility.
        className="flex items-center justify-center p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors space-x-1"
        aria-label="Select language" // Good for accessibility.
      >
        {/* Display the flag emoji of the currently active language. */}
        <span className="text-lg leading-none">{activeLang.flag}</span>
        {/* Dropdown arrow icon, rotates when the dropdown is open. */}
        <FiChevronDown className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {/* The dropdown menu itself. Conditionally rendered based on `dropdownOpen` state. */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-xl z-50 py-1">
          {/* Map through the LANGUAGES array to create a button for each language. */}
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code} // Unique key for list rendering.
              onClick={() => changeLanguage(lang.code)} // Calls changeLanguage with the selected language code.
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <span className="text-lg">{lang.flag}</span> {/* Flag Emoji */}
              <span>{lang.name}</span> {/* Language Name */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
