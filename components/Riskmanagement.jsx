'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function RiskManagement() {
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
          <p className="text-sm uppercase text-gray-500 mb-2">Risk Strategy</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 font-garamond">
            Risk Management Meets Precision
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-barlow">
            At Rosnept, we blend advanced algorithms with strategic oversight to manage risk with precision. Our disciplined framework spans asset allocation, hedging, and real-time monitoring to minimize volatility while maximizing potential. Each investment decision is backed by data, experience, and proactive controls to protect capital and seize opportunity. Whether markets rise or fall, our resilient approach ensures your portfolio stays on track. Grow your wealth with confidence, knowing that every move is calculated for stability, performance, and long-term success.
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
              alt="Crypto Security"
              layout="fill"
              objectFit="cover"
              className=""
            />
          </div>
          <div className="px-6 py-8">
            <h3 className="text-xl font-garamond font-bold text-white mb-2">
              Digital Assets
            </h3>
            <p className="text-white text-sm leading-relaxed font-barlow">
              Our crypto strategies are fortified with real-time risk signals, multi-layered cold storage, and automated hedging. This ensures exposure to high-performing digital assets without undue downside vulnerability.
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
              alt="Agro Risk"
              layout="fill"
              objectFit="cover"
              className=""
            />
          </div>
          <div className="px-6 py-8">
            <h3 className="text-xl font-garamond font-bold text-white mb-2">
              Agro Investment
            </h3>
            <p className="text-white text-sm leading-relaxed font-barlow">
              Our risk controls in agriculture focus on climate trends, logistics, and market demand. By analyzing supply chain data and seasonal forecasts, we hedge potential disruptions and stabilize returns for farm-to-export projects.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
