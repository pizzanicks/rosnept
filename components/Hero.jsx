// components/Hero.jsx
'use client';

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from 'next/link';

// --- NEW IMPORT FOR TRANSLATION ---
import { useTranslation } from 'next-i18next';
// --- END NEW IMPORT ---

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const handleSlideChange = (swiper) => {
    setActiveSlide(swiper.activeIndex);
  };

  // --- Initialize the translation hook ---
  const { t } = useTranslation('common'); // Assuming 'common' is your default namespace for general strings
  // --- End translation hook initialization ---

  const slides = [
    {
      image: '/img-11.jpg',
      // --- Use translation keys for slide content ---
      titleKey: 'hero_slide1_title',
      subtitleKey: 'hero_slide1_subtitle',
      ctaKey: 'hero_slide1_cta'
    },
    {
      image: '/img-7.jpg',
      titleKey: 'hero_slide2_title',
      subtitleKey: 'hero_slide2_subtitle',
      ctaKey: 'hero_slide2_cta'
    },
    {
      image: '/img-6.png',
      titleKey: 'hero_slide3_title',
      subtitleKey: 'hero_slide3_subtitle',
      ctaKey: 'hero_slide3_cta'
    },
  ];

  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation={false}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSlideChange={handleSlideChange}
        speed={1500}
        className="w-full h-[70vh] lg:h-[100vh] bg-black"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative w-full h-full bg-black bg-cover bg-center flex items-center justify-center font-garamond pt-32 lg:pt-12 transition-colors duration-500"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#000000]/50 z-0" />

              <div className="relative z-10 px-6 py-20 text-left text-white max-w-5xl mx-auto">
                {/* Stars - keeping as static characters as they are visual */}
                <div className="flex space-x-1 text-yellow-400 text-xl mb-2">
                    {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                    ))}
                </div>

                <h1 className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md">
                  {t(slide.titleKey)}<br /> {/* Translate title */}
                  {t(slide.subtitleKey)} {/* Translate subtitle */}
                </h1>

                {/* Short text under stars - now translated */}
                <p className="text-sm lg:text-lg mb-6 text-white/90 font-barlow">
                  {t('hero_trusted_message')} {/* Translate "Trusted by thousands..." */}
                </p>

                {/* Outline button - now translated */}
                <Link href="/plans" legacyBehavior>
                  <a className="text-sm uppercase font-barlow inline-block border border-white hover:bg-white hover:text-black text-white px-6 py-3 shadow-md transition cursor-pointer">
                    {t(slide.ctaKey)} {/* Translate CTA button text */}
                  </a>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
