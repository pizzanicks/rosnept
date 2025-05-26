// components/QuoteSection.tsx
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const QuoteSection = () => {
  return (
    <section
      className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center text-white px-4"
      style={{ backgroundImage: 'url(/bg-200.jpg)' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Stars */}
        <div className="flex justify-center space-x-1 mb-3 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-xl" />
          ))}
        </div>

        {/* Small Title */}
        <p className="text-sm uppercase tracking-wider text-gray-300 mb-2">Words to Invest By</p>

        {/* Quote */}
        <h2 className="text-2xl md:text-4xl font-garamond font-semibold leading-snug md:leading-tight">
          "True sustainability in investing isn&apos;t just about returns — it&apos;s about building a future where profit and purpose align."
        </h2>
      </motion.div>
    </section>
  );
};

export default QuoteSection;
