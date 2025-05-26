'use client';

import { FaLeaf, FaChartLine, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const benefits = [
  {
    title: 'Sustainable Growth',
    description:
      'We align your investments with long-term sustainability trends—like clean energy and ethical farming—without compromising profitability.',
    icon: <FaLeaf size={24} />,
    fadedIcon: FaLeaf,
  },
  {
    title: 'Data-Driven Strategy',
    description:
      'Our proprietary algorithms and market analytics help us balance risk and reward, maximizing gains while minimizing volatility.',
    icon: <FaChartLine size={24} />,
    fadedIcon: FaChartLine,
  },
  {
    title: 'Secure & Transparent',
    description:
      'We prioritize security and visibility. Real-time dashboards, weekly updates, and reliable custody ensure peace of mind.',
    icon: <FaLock size={24} />,
    fadedIcon: FaLock,
  },
];

export default function WhyInvestSection() {
  return (
    <section className="w-full bg-white py-16 px-6 lg:px-12">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Section Titles */}
        <p className="text-sm uppercase text-gray-500 mb-2">Why Invest With Us</p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-10 font-garamond">
          The Delta Advantage
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {benefits.map((item, idx) => {
            const FadedIcon = item.fadedIcon;
            return (
              <motion.div
                key={idx}
                className="relative bg-white border border-gray-200 px-6 py-8 flex flex-col space-y-4 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6, ease: 'easeOut' }}
              >
                {/* Faded Background Icon */}
                <FadedIcon className="absolute text-gray-200 text-[120px] bottom-[-10px] right-[-10px] pointer-events-none" />

                {/* Foreground Icon */}
                <div className="text-gray-900 z-10">{item.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 z-10">{item.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 z-10 font-barlow">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
