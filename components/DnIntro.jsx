'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function RosneplIntro() {
  return (
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left - Images */}
        <div className="relative w-full md:w-1/2 h-[400px] lg:h-[500px]">
            <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="w-3/4 h-[240px] lg:h-[280px] relative ml-auto"
                >
                <Image
                    src="/hr-3.jpg"
                    alt="Rosnept Strategy"
                    fill
                    className="object-cover"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="w-3/4 h-[240px] lg:h-[280px] absolute left-[0px] lg:left-[-20px] bottom-[-20px] lg:bottom-[-10px] shadow-lg"
            >
                <Image
                src="/blg-5.png"
                alt="Clean Energy Investments"
                fill
                className="object-cover"
                />
            </motion.div>
        </div>

        {/* Right - Text */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase text-gray-500 mb-2">About Rosnept</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 font-garamond">
            Bridging Innovation with Sustainability
          </h2>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed font-barlow">
            Rosnept is a forward-thinking investment firm focused on sustainable returns through a balanced strategy across cryptocurrency, renewable energy, agriculture, and gold. Our mission is to empower investors with smart, secure, and socially responsible investment opportunities that perform in any market condition.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
