// components/Navbar.jsx
'use client'; // This component includes client-side hooks (useState, useEffect, useTranslation)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for mobile menu toggle
import { motion, AnimatePresence } from 'framer-motion'; // For animation effects
import Image from 'next/image'; // For Next.js optimized images
import { useTranslation } from 'next-i18next'; // --- NEW: Hook to access translations

// Import the custom LanguageSwitcher component
import LanguageSwitcher from './LanguageSwitcher'; // Assumes LanguageSwitcher.jsx is in the same 'components' folder

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu open/close
  const [hasScrolled, setHasScrolled] = useState(false); // State to track scroll position for header styling
  // Initialize the useTranslation hook, specifying the 'common' namespace.
  // This makes the `t` function available to translate strings defined in public/locales/[locale]/common.json.
  const { t } = useTranslation('common'); // --- NEW: Initialize translation hook

  const toggleMenu = () => setIsOpen(!isOpen); // Toggles the mobile menu state

  // Define main navigation links using translation keys from common.json.
  // The 'name' property will dynamically get its value from the translation file.
  const navLinks = [
    { name: t('home_link'), link: '/' }, // --- NOW TRANSLATED ---
    { name: t('about_link'), link: '/about' }, // --- NOW TRANSLATED ---
    { name: t('services_link'), link: '/services' }, // --- NOW TRANSLATED ---
    { name: t('plans_link'), link: '/plans' }, // --- NOW TRANSLATED ---
    { name: t('contact_link'), link: '/contact' }, // --- NOW TRANSLATED ---
  ];  

  // Define authentication-related links using translation keys.
  const authLinks = [
    { name: t('login_button'), link: '/auth/login' }, // --- NOW TRANSLATED ---
    { name: t('signup_button'), link: '/auth/signup' } // --- NOW TRANSLATED ---
  ];

  // Effect to handle the scroll behavior of the Navbar (changing background/text color).
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) { // If scrolled more than 10px
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll); // Attach scroll listener
    return () => window.removeEventListener('scroll', handleScroll); // Clean up on unmount
  }, []); // Empty dependency array means this runs once on mount.

  return (
    <header
      className={`
        fixed w-full px-6 py-4 flex items-center 
        z-[9999] transition-all duration-300
        ${hasScrolled ? 'bg-white shadow-lg justify-between text-black' : 'md:bg-transparent justify-between text-white'}
      `}
    >
      {/* Logo/Brand Image: dynamically changes based on scroll position */}
      <Image 
        src={hasScrolled ? '/logo-2.png' : '/logo-1.png'} 
        height={500} 
        width={500} 
        alt='logo image' 
        className={`${hasScrolled ? 'w-44 lg:w-60 h-10 lg:h-14' : 'w-44 lg:w-60 h-12 lg:h-16'}`} 
      />

      {/* Desktop Navigation and Right-Aligned Items */}
      <div className="hidden md:flex items-center gap-6"> {/* Use flex to align nav and new items */}
        {/* Main Desktop Navigation Links */}
        <nav className="text-sm font-medium uppercase">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.link}>
              <span className={`${hasScrolled ? "hover:text-gray-700" : "hover:text-indigo-200"} transition duration-200 cursor-pointer font-barlow mr-6`}>
                {link.name} {/* Display translated link name */}
              </span>
            </Link>
          ))}
        </nav>

        {/* --- DESKTOP RIGHT-SIDE ITEMS: Authentication Links + Language Switcher --- */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <span className={`${hasScrolled ? "text-blue-600 hover:text-blue-800" : "text-white hover:text-indigo-200"} transition duration-200 cursor-pointer font-barlow uppercase text-sm`}>
              {t('login_button')} {/* Display translated Login Button text */}
            </span>
          </Link>
          <Link href="/signup">
            <span className={`px-4 py-2 rounded-md ${hasScrolled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-blue-600 hover:bg-gray-200"} transition duration-200 cursor-pointer font-barlow uppercase text-sm`}>
              {t('signup_button')} {/* Display translated Sign Up Button text */}
            </span>
          </Link>
          {/* Integrate the LanguageSwitcher component here for desktop view */}
          <LanguageSwitcher />
        </div>
        {/* --- END DESKTOP RIGHT-SIDE ITEMS --- */}
      </div>

      {/* Mobile Toggle Button and Mobile Language Switcher */}
      <div className="md:hidden flex items-center gap-4">
        {/* Mobile Language Switcher: Placed here for quick access even when mobile menu is closed */}
        <LanguageSwitcher />
        {/* Mobile Menu Toggle Button */}
        <button className={`text-2xl z-50 ${hasScrolled ? 'text-black' : 'text-white'} rounded-full p-2`} onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />} {/* Changes icon based on menu state */}
        </button>
      </div>

      {/* Mobile Menu (Animated Slide-in) */}
      <AnimatePresence>
      {isOpen && (
        <>
          {/* Optional: subtle dark backdrop behind the mobile menu */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)} // Closes menu if backdrop is clicked
          />

          {/* The sleek mobile menu panel */}
          <motion.div
            className="fixed top-20 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-white uppercase text-sm px-6 py-6 flex flex-col justify-between h-[70vh] md:hidden z-50 shadow-xl"
            initial={{ opacity: 0, y: -20 }} // Animation: starts slightly above and invisible
            animate={{ opacity: 1, y: 0 }}    // Animation: slides down and fades in
            exit={{ opacity: 0, y: -20 }}     // Animation: slides up and fades out on exit
          >
            <div className="flex flex-col gap-5">
              {/* Main Navigation Links for Mobile */}
              {navLinks.map((link, index) => (
                <Link key={index} href={link.link} onClick={() => setIsOpen(false)}> {/* Close menu on link click */}
                  <span className="hover:text-indigo-300 transition duration-200 cursor-pointer font-barlow">{link.name}</span>
                </Link>
              ))}
              {/* Auth Links for Mobile (inside dropdown) */}
              <div className="border-t border-white/20 pt-5 mt-5 flex flex-col gap-5">
                {authLinks.map((link, index) => (
                  <Link key={`auth-${index}`} href={link.link} onClick={() => setIsOpen(false)}> {/* Close menu on link click */}
                    <span className="hover:text-indigo-300 transition duration-200 cursor-pointer font-barlow">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Email in Mobile Menu */}
            <div className="pt-6 mt-6 border-t border-white/20 text-xs text-center">
              <span className="text-white/70">support@Rosnepl.org</span>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </header>
  );
}
