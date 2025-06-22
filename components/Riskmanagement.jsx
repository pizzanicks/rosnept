// components/RiskManagement.jsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
// --- NEW IMPORT FOR TRANSLATION ---
import { useTranslation } from 'next-i18next';
// --- END NEW IMPORT ---

export default function RiskManagement() {
  // --- Initialize the translation hook ---
  const { t } = useTranslation('common');
  // --- End translation hook initialization ---

  return (
    <section className="w-full bg-gray-900 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start">
        
        {/* Left Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Translated "Risk Strategy" */}
          <p className="text-sm uppercase text-gray-500 mb-2">{t('risk_strategy_heading_sub')}</p>
          {/* Translated "Risk Management Meets Precision" */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 font-garamond">
            {t('risk_strategy_heading_main')}
          </h2>
          {/* Translated main description */}
          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-barlow">
            {t('risk_strategy_description')}
          </p>
        </motion.div>

        {/* Middle Column - Digital Assets */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-800 overflow-hidden"
        >
          <div className="relative w-full h-60">
            <Image
              src="/rk-2.jpg"
              alt={t('risk_digital_assets_image_alt')} // Alt text translated
              layout="fill"
              objectFit="cover"
              className=""
            />
          </div>
          <div className="px-6 py-8">
            {/* Translated "Digital Assets" title */}
            <h3 className="text-xl font-garamond font-bold text-white mb-2">
              {t('risk_digital_assets_title')}
            </h3>
            {/* Translated digital assets description */}
            <p className="text-white text-sm leading-relaxed font-barlow">
              {t('risk_digital_assets_description')}
            </p>
          </div>
        </motion.div>

        {/* Right Column - Agro Investment */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gray-800 overflow-hidden"
        >
          <div className="relative w-full h-60">
            <Image
              src="/rk-1.jpg"
              alt={t('risk_agro_investment_image_alt')} // Alt text translated
              layout="fill"
              objectFit="cover"
              className=""
            />
          </div>
          <div className="px-6 py-8">
            {/* Translated "Agro Investment" title */}
            <h3 className="text-xl font-garamond font-bold text-white mb-2">
              {t('risk_agro_investment_title')}
            </h3>
            {/* Translated agro investment description */}
            <p className="text-white text-sm leading-relaxed font-barlow">
              {t('risk_agro_investment_description')}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
