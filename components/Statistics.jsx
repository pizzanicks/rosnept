'use client';

import { motion } from 'framer-motion';
import { FaBitcoin, FaLandmark, FaSeedling, FaUsers } from 'react-icons/fa';

export default function StatsSection() {
  return (
    <section className="w-full bg-gray-100 py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-10 md:gap-0">
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center w-full md:w-1/4"
          >
            <div className="absolute inset-0 flex justify-center items-center opacity-10">
              <FaBitcoin className="text-6xl text-gray-300" />
            </div>
            <div className="text-4xl font-extrabold text-green-500 mb-4">+23%</div>
            <p className="text-sm md:text-base text-gray-500 font-barlow">Annual Return</p>
          </motion.div>

          {/* Horizontal Divider for Mobile */}
          <div className="w-1/2 md:w-[2px] h-1 md:h-[80px] border-t-2 md:border-l-2 border-gray-200 md:hidden"></div>

          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex flex-col items-center w-full md:w-1/4"
          >
            <div className="absolute inset-0 flex justify-center items-center opacity-10">
              <FaLandmark className="text-6xl text-gray-300" />
            </div>
            <div className="text-4xl font-extrabold text-blue-500 mb-4">200+</div>
            <p className="text-sm md:text-base text-gray-500 font-barlow">Projects Funded</p>
          </motion.div>

          {/* Horizontal Divider for Mobile */}
          <div className="w-1/2 md:w-[2px] h-1 md:h-[80px] border-t-2 md:border-l-2 border-gray-200 md:hidden"></div>

          {/* Stat 3 */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex flex-col items-center w-full md:w-1/4"
          >
            <div className="absolute inset-0 flex justify-center items-center opacity-10">
              <FaSeedling className="text-6xl text-gray-300" />
            </div>
            <div className="text-4xl font-extrabold text-orange-500 mb-4">50+</div>
            <p className="text-sm md:text-base text-gray-500 font-barlow">Countries Reached</p>
          </motion.div>

          {/* Horizontal Divider for Mobile */}
          <div className="w-1/2 md:w-[2px] h-1 md:h-[80px] border-t-2 md:border-l-2 border-gray-200 md:hidden"></div>

          {/* Stat 4 */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex flex-col items-center w-full md:w-1/4"
          >
            <div className="absolute inset-0 flex justify-center items-center opacity-10">
              <FaUsers className="text-6xl text-gray-300" />
            </div>
            <div className="text-4xl font-extrabold text-yellow-500 mb-4">1M+</div>
            <p className="text-sm md:text-base text-gray-500 font-barlow">Investors Impacted</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
