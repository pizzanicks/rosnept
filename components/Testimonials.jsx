'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import { FaStar, FaQuoteRight } from 'react-icons/fa';

const testimonials = [
  {
    quote:
      "Rosnept has completely transformed how I think about investing. Their unique blend of algorithmic strategies and sustainability gives me peace of mind and consistent growth I can rely on.",
    name: "Leila Morissette",
    role: "Impact Venture Builder",
    image: "/per-1.png",
  },
  {
    quote:
      "I appreciate how transparent and efficient the entire system is. Weekly returns are predictable, and reinvesting into renewable energy feels like I'm growing my wealth and supporting the planet.",
    name: "Omar Farouk",
    role: "Blockchain Researcher",
    image: "/per-2.png",
  },
  {
    quote:
      "Their risk management strategy is unlike anything I’ve seen. Even in volatile markets, I never felt exposed. My capital keeps growing, and their updates keep me fully informed every week.",
    name: "Nadira Voss",
    role: "Quantitative Finance Lead",
    image: "/per-4.png",
  }
];

export default function Testimonials() {
  return (
    <section className="relative w-full py-20 px-6 bg-cover bg-center bg-no-repeat min-h-[60vh] flex justify-center items-center" style={{ backgroundImage: "url('/rev-1.png')" }}>
      <div className="absolute inset-0 bg-black/80" />

      <div className="max-w-[100%] lg:max-w-5xl mx-auto z-20 text-left text-white">
        <p className="text-sm uppercase tracking-widest text-white/60 mb-2">Testimonial</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-garamond">What Our Investors Say</h2>
        <div className="w-16 h-[2px] bg-white/30 mb-8" />

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={30}
        //   className="max-w-3xl"
        >
          {testimonials.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative flex flex-col space-y-6 overflow-hidden">
                <p className="text-sm lg:text-base font-barlow leading-relaxed text-white/90">{item.quote}</p>
                <FaQuoteRight className="absolute top-20 md:top-10 right-4 md:right-10 text-white/20 text-6xl z-10" />

                <div className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
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
                    <p className="text-white font-semibold font-barlow">{item.name}</p>
                    <p className="text-sm text-white/60 font-barlow">{item.role}</p>
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
