import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { FaStar } from "react-icons/fa";
import Link from 'next/link';

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const handleSlideChange = (swiper) => {
    setActiveSlide(swiper.activeIndex);
  };

  const slides = [
    {
      image: '/img-11.jpg',
      title: 'Grow with Purpose',
      subtitle: 'Support sustainable agriculture. Earn steady returns.',
      cta: 'Start Investing'
    },
    {
      image: '/img-7.jpg',
      title: 'Crypto, Controlled',
      subtitle: 'Harness volatility with algorithmic trading & DeFi.',
      cta: 'Explore Crypto'
    },
    {
      image: '/img-6.png',
      title: 'Power the Future',
      subtitle: 'Invest in clean energy with real-world impact.',
      cta: 'Invest in Energy'
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
                {/* Title & Subtitle */}

                {/* Stars */}
                <div className="flex space-x-1 text-yellow-400 text-xl mb-2">
                    {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                    ))}
                </div>

                <h1 className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md">
                  {slide.title}<br />
                  {slide.subtitle}
                </h1>

                {/* Short text under stars */}
                <p className="text-sm lg:text-lg mb-6 text-white/90 font-barlow">
                  Trusted by thousands of investors worldwide.
                </p>

                {/* Outline button */}
                <Link href="/plans">
                  <span className="text-sm uppercase font-barlow inline-block border border-white hover:bg-white hover:text-black text-white px-6 py-3 shadow-md transition cursor-pointer">
                    {slide.cta}
                  </span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
