import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Services', link: '/services' },
    { name: 'Plans', link: '/plans' },
    { name: 'Contact', link: '/contact' },
    { name: 'Login', link: '/auth/login' },
    { name: 'Sign Up', link: '/auth/signup' }
  ];  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed w-full px-6 py-4 flex items-center 
        z-[9999] transition-all duration-300
        ${hasScrolled ? 'bg-white shadow-lg justify-between text-black' : 'md:bg-transparent justify-between text-white'}
      `}
    >
      <Image src={hasScrolled ? '/logo-2.png' : '/logo-1.png'} height={500} width={500} alt='logo image' className={`${hasScrolled ? 'w-44 lg:w-60 h-10 lg:h-14' : 'w-44 lg:w-60 h-12 lg:h-16'}`} />

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 text-sm font-medium uppercase">
        {navLinks.map((link, index) => (
          <Link key={index} href={link.link}>
            <span className={`${hasScrolled ? "hover:text-gray-700" : "hover:text-indigo-200"} transition duration-200 cursor-pointer font-barlow`}>{link.name}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Toggle */}
      <button className={`md:hidden text-2xl z-50 ${hasScrolled ? 'text-black' : 'bg-text-white'} rounded-full p-2`} onClick={toggleMenu}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      <AnimatePresence>
      {isOpen && (
        <>
          {/* Optional: subtle dark backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Sleek Mobile Menu */}
          <motion.div
            className="fixed top-20 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 text-white uppercase text-sm px-6 py-6 flex flex-col justify-between h-[70vh] md:hidden z-50 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link, index) => (
                <Link key={index} href={link.link}>
                  <span className="hover:text-indigo-300 transition duration-200 cursor-pointer font-barlow">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Support Email */}
            <div className="pt-6 mt-6 border-t border-white/20 text-xs text-center">
              <span className="text-white/70">support@deltaneutral.org</span>
            </div>
          </motion.div>
        </>
      )}

      </AnimatePresence>
    </header>
  );
}
