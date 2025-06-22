// components/Testimonials.jsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import { FaStar, FaQuoteRight } from 'react-icons/fa';
// --- NEW IMPORT FOR TRANSLATION ---
import { useTranslation } from 'next-i18next';
// --- END NEW IMPORT ---

export default function Testimonials() {
  // --- Initialize the translation hook ---
  const { t } = useTranslation('common');
  // --- End translation hook initialization ---

  // The testimonials data now uses translation keys for quote, name, and role.
  // The 'image' path remains static as it's a file path.
  const testimonials = [
    {
      quoteKey: "testimonial_leila_quote",
      nameKey: "testimonial_leila_name",
      roleKey: "testimonial_leila_role",
      image: "/per-1.png",
    },
    {
      quoteKey: "testimonial_omar_quote",
      nameKey: "testimonial_omar_name",
      roleKey: "testimonial_omar_role",
      image: "/per-2.png",
    },
    {
      quoteKey: "testimonial_nadira_quote",
      nameKey: "testimonial_nadira_name",
      roleKey: "testimonial_nadira_role",
      image: "/per-4.png",
    }
  ];

  return (
    <section className="relative w-full py-20 px-6 bg-cover bg-center bg-no-repeat min-h-[60vh] flex justify-center items-center" style={{ backgroundImage: "url('/rev-1.png')" }}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="max-w-[100%] lg:max-w-5xl mx-auto z-20 text-left text-white">
        {/* Translated "Testimonial" sub-heading */}
        <p className="text-sm uppercase tracking-widest text-white/60 mb-2">{t('testimonial_subheading')}</p>
        {/* Translated "What Our Investors Say" main heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-garamond">{t('testimonial_main_heading')}</h2>
        <div className="w-16 h-[2px] bg-white/30 mb-8" />

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={30}
        >
          {testimonials.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative flex flex-col space-y-6 overflow-hidden">
                {/* Translated quote */}
                <p className="text-sm lg:text-base font-barlow leading-relaxed text-white/90">{t(item.quoteKey)}</p>
                <FaQuoteRight className="absolute top-20 md:top-10 right-4 md:right-10 text-white/20 text-6xl z-10" />

                <div className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={t(item.nameKey)} // Alt text also translated for accessibility
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                  <div>
                    {/* 5-Star */}
                    <div className="flex space-x-1 text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                        ))}
                    </div>
                    {/* Translated name */}
                    <p className="text-white font-semibold font-barlow">{t(item.nameKey)}</p>
                    {/* Translated role */}
                    <p className="text-sm text-white/60 font-barlow">{t(item.roleKey)}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
