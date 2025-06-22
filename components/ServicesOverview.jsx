// components/ServicesOverviewWithImages.jsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// --- NEW IMPORT FOR TRANSLATION ---
import { useTranslation } from 'next-i18next';
// --- END NEW IMPORT ---

export default function ServicesOverviewWithImages() {
  // --- Initialize the translation hook ---
  const { t } = useTranslation('common');
  // --- End translation hook initialization ---

  // The services data now uses translation keys for title, description, and cta.
  // 'href' and 'image' paths remain static.
  const services = [
    {
      titleKey: 'service_crypto_title',
      descriptionKey: 'service_crypto_description',
      ctaKey: 'service_crypto_cta',
      href: '/plans',
      image: '/bg-201.jpg',
    },
    {
      titleKey: 'service_agro_title',
      descriptionKey: 'service_agro_description',
      ctaKey: 'service_agro_cta',
      href: '/plans',
      image: '/sv-1.jpg',
    },
    {
      titleKey: 'service_clean_energy_title',
      descriptionKey: 'service_clean_energy_description',
      ctaKey: 'service_clean_energy_cta',
      href: '/plans',
      image: '/sv-4.jpg',
    },
    {
      titleKey: 'service_gold_title',
      descriptionKey: 'service_gold_description',
      ctaKey: 'service_gold_cta',
      href: '/plans',
      image: '/blg-3.jpg',
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12 lg:space-y-24">
        {services.map((service, index) => (
          <motion.div
            key={service.titleKey} // Use titleKey for key
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
                alt={t(service.titleKey)} // Translate alt text
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-5">
              {/* Translated title */}
              <h3 className="text-3xl lg:text-4xl font-garamond font-semibold text-gray-900">{t(service.titleKey)}</h3>
              {/* Translated description */}
              <p className="text-gray-700 leading-relaxed font-barlow">{t(service.descriptionKey)}</p>
              <Link
                href={service.href}
                className="inline-block border border-gray-900 text-gray-900 px-6 py-2 text-sm font-barlow uppercase tracking-wide hover:bg-gray-900 hover:text-white transition"
              >
                {t(service.ctaKey)} {/* Translated CTA text */}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
