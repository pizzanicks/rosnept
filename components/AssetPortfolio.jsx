'use client';

import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const portfolio = [
  {
    title: 'Renewable Energy',
    subtitle: 'Solar Grids, Wind Farms, EV Infrastructure',
    image: '/pt-1.jpg'
  },
  {
    title: 'Digital Assets',
    subtitle: 'Bitcoin, Yield Farming, DeFi Strategies',
    image: '/pt-2.jpg'
  },
  {
    title: 'Agro Investment',
    subtitle: 'Smart Farming, Processing, Export Chains',
    image: '/pt-3.jpg'
  }
];

export default function AssetPortfolio() {
  return (
    <section className="w-full bg-gray-100 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase text-gray-500 mb-2">Our Portfolio</p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-10 font-garamond">
          Rosnept Asset Streams
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {portfolio.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: 'easeOut' }}
              whileHover={{ y: -5 }}
              className="relative group overflow-hidden h-[400px] lg:h-[600px] cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

              {/* Card Content */}
              <div className="absolute bottom-6 left-6 right-6 z-20 transition-all duration-500 group-hover:bottom-16">
                <p className="text-sm uppercase text-white/80 tracking-wide mb-1">{item.title}</p>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                  {item.subtitle}
                </h3>

                {/* CTA appears on card hover */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-in-out mt-4">
                  <div className="w-10 h-[2px] bg-white mb-2" />
                  <Link href={'/auth/signup'} className="flex items-center text-white text-sm uppercase font-barlow">
                    Get Started <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
