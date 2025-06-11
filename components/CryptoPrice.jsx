import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const TopCryptos = () => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false'
        );
        const data = await response.json();
        setCryptos(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
  }, []);

  return (
    <section className="w-full bg-gray-100 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-10 font-garamond text-start md:text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Top Cryptocurrencies
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-3">
          {cryptos.map((crypto, index) => (
            <motion.div
              key={crypto.id}
              className="bg-white shadow-md p-6 flex items-center gap-4 hover:shadow-xl transition"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <Image src={crypto.image} height={200} width={200} alt={crypto.name} className="w-10 h-10" />
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {crypto.name} <span className="text-sm text-gray-500">({crypto.symbol.toUpperCase()})</span>
                </p>
                <p className="text-gray-700">${crypto.current_price.toLocaleString()}</p>
                <p
                  className={`text-sm ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCryptos;
