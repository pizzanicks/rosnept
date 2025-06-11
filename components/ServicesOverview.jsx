'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const services = [
    {
      title: 'Cryptocurrency Investments',
      description:
        'Rosnept provides a structured approach to cryptocurrency investing, combining innovation with strategic risk management. Our team helps you tap into high-growth digital assets while minimizing exposure to volatility. With tailored strategies, we make it easier for you to confidently invest in the future of decentralized finance.',
      cta: 'Get Started',
      href: '/plans',
      image: '/bg-201.jpg',
    },
    {
      title: 'Agro Investment',
      description:
        'Rosnept connects you to impactful agricultural investments that promote food security and innovation. Our ventures focus on sustainable farming, agritech, and regenerative practices. We help you grow your capital by backing initiatives that nourish communities and the planet while delivering strong, consistent performance in your portfolio.',
      cta: 'Build Portfolio',
      href: '/plans',
      image: '/sv-1.jpg',
    },
    {
        title: 'Clean Energy Projects',
        description:
          'At Rosnept, we believe in powering portfolios through sustainability. Our clean energy investments focus on renewable technologies that drive long-term returns while supporting a greener planet. From solar to wind, we offer access to transformative energy projects designed for modern investors seeking purpose-driven performance.',
        cta: 'Explore Plans',
        href: '/plans',
        image: '/sv-4.jpg',
    },
    {
      title: 'Gold-backed Stability',
      description:
        'Gold has long been a cornerstone of wealth preservation. Rosnept offers modern gold investment solutions that anchor your portfolio with time-tested security. In uncertain markets, our gold-backed strategies provide dependable value and protection, helping you achieve financial resilience with a legacy asset that never goes out of style.',
      cta: 'Start Investing',
      href: '/plans',
      image: '/blg-3.jpg',
    },
];
  
export default function ServicesOverviewWithImages() {
  return (
    <section className="w-full bg-white py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-24">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`grid md:grid-cols-2 gap-10 items-center ${
              index % 2 !== 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="relative w-full h-[280px] md:h-[320px]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-5">
              <h3 className="text-3xl lg:text-4xl font-garamond font-semibold text-gray-900">{service.title}</h3>
              <p className="text-gray-700 leading-relaxed font-barlow">{service.description}</p>
              <Link
                href={service.href}
                className="inline-block border border-gray-900 text-gray-900 px-6 py-2 text-sm font-barlow uppercase tracking-wide hover:bg-gray-900 hover:text-white transition"
              >
                {service.cta}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
