'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section
      className="relative w-full h-[400px] lg:h-[560px] bg-cover bg-center"
      style={{ backgroundImage: "url('/cta.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center justify-end text-white">
        <motion.div
          className="max-w-lg text-right"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold font-garamond">
            Invest Smarter. Grow Sustainably.
          </h2>
          <p className="mt-4 text-sm lg:text-lg font-barlow">
            Join Rosnept and take the first step toward building long-term wealth through balanced strategies in crypto, clean energy, agriculture, and gold. Your future deserves a smarter investment plan.
          </p>
          <Link href="/auth/signup" passHref legacyBehavior>
            <motion.div
              className="mt-6 inline-block border border-white hover:bg-white hover:text-black text-white uppercase text-sm font-barlow px-6 py-3 shadow-md transition cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
