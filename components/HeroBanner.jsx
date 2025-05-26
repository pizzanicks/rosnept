import { FaStar } from 'react-icons/fa';

export default function HeroBanner({ image, title, description }) {
  return (
    <div
      className="relative w-full h-[60vh] lg:h-[60vh] bg-black bg-cover bg-center flex items-center justify-center font-garamond transition-colors duration-500 pt-32 lg:pt-32"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Content */}
      <div className="relative z-10 px-6 text-left text-white max-w-4xl mx-auto">
        {/* Title */}

        {/* Stars */}
        <div className="flex space-x-1 text-yellow-400 text-xl mb-2">
            {[...Array(5)].map((_, i) => (
            <span key={i}>★</span>
            ))}
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-md">
          {title}
        </h1>

        {/* Description */}
        <p className="text-sm lg:text-lg text-white/90 font-barlow">
          {description}
        </p>
      </div>
    </div>
  );
}
