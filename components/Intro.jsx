import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function IntroSection() {
  return (
    <section className="w-full bg-white py-12 lg:py-18 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center"
      >
        {/* Left Column */}
        <div className="md:col-span-6 space-y-4">

          {/* Titles */}
          <p className="text-sm uppercase text-gray-600 tracking-wide">Trusted & Transparent</p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight font-garamond">
            Invest in the Future of Sustainable Wealth
          </h2>

          {/* Paragraph */}
          <p className="text-gray-700 text-sm md:text-base max-w-xl font-barlow">
            At Rosnept, we help you grow wealth through impact-driven investments. Our strategy blends high-yield crypto opportunities, renewable energy infrastructure, and sustainable agriculture—three powerful pillars shaping the future. With weekly returns, transparent performance, and built-in risk management, we make it easy to invest with confidence and conscience. Whether you're building your portfolio or seeking stable diversification, Rosnept bridges innovation with long-term value.
          </p>

          {/* Button */}
          <Link href={'/about'} className="inline-flex items-center border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-5 py-3 transition text-sm uppercase font-barlow">
            Learn More <FaArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="md:col-span-6 flex flex-row md:grid md:grid-cols-6 gap-2 lg:gap-4">
          {/* Center Image (pushed down) */}
          <div className="md:col-span-3 mt-20">
              <Image
                  src="/img-5.png"
                  alt="Investment Gold"
                  width={500}
                  height={500}
                  className="w-full h-72 lg:h-96 object-cover"
              />
          </div>


          {/* Right Image (no margin, no border radius) */}
          <div className="md:col-span-3">
            <Image
              src="/img-9.jpg"
              alt="Green Energy"
              width={500}
              height={500}
              className="w-full h-72 lg:h-96 object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
