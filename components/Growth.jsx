import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SustainableGrowthSection() {
  return (
    <section className="w-full bg-gray-100 py-16 px-6 lg:px-12">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* First Row - Sustainable Investments */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Image Left */}
          <div className="w-full md:w-1/2 h-72 lg:h-96 md:h-auto relative">
            <Image
              src="/grw-1.jpg"
              alt="Sustainable Investment"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>

          {/* Text Right */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-0 lg:px-6 py-10 md:px-12">
            <p className="text-sm uppercase text-gray-500 mb-2">Sustainability</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 font-garamond">Investing in a Sustainable Future</h2>
            <p className="text-sm lg:text-base text-gray-700 leading-relaxed font-barlow">
              At Rosnept, we believe that true growth comes from investing in industries that promote environmental responsibility and social good. Our investment strategies are designed to focus on clean energy, green technology, and other sustainable sectors. We are committed to generating long-term financial returns while also contributing positively to the planet and society. Together, we can create a brighter, more sustainable future.
            </p>
          </div>
        </div>

        {/* Second Row - Impactful Growth */}
        <div className="flex flex-col md:flex-row-reverse w-full">
          {/* Image Right */}
          <div className="w-full md:w-1/2 h-72 lg:h-96 md:h-auto relative">
            <Image
              src="/grw-2.jpg"
              alt="Impactful Growth"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>

          {/* Text Left */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-0 lg:px-6 py-10 md:px-12">
            <p className="text-sm uppercase text-gray-500 mb-2">Impact</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 font-garamond">Generating Impactful Growth</h2>
            <p className="text-sm lg:text-base text-gray-700 leading-relaxed font-barlow">
              Our investment model combines cutting-edge technology with a deep commitment to sustainability. We focus on growth that not only benefits our investors but also contributes to the global push for a greener economy. Through our approach, we aim to provide our investors with profitable returns while making a measurable, positive impact on the world.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
