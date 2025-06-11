'use client';

import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section className="w-full py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start gap-12">
        {/* Left: Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-4/5 bg-white p-8 border mx-auto"
        >
          <h2 className="text-3xl lg:text-4xl font-garamond font-bold mb-6 text-gray-900">
            Let&apos;s Talk
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-8 font-barlow">
            Whether you're ready to invest or just exploring your options, we&apos;d love to hear from you. Send us a message and our team will get back to you promptly.
          </p>
          <form className="space-y-6 font-barlow">
            <div>
              <label className="block text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Message</label>
              <textarea
                rows="5"
                placeholder="Tell us what you're looking for..."
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Right: Contact Info */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-6 text-gray-900"
        >
            {/* 5-Star */}
            <div className="flex space-x-1 text-yellow-400 text-xl">
                {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
                ))}
            </div>

            {/* Vision */}
            <div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed font-barlow">
                    Our vision is to make secure, innovative investment opportunities accessible to everyone, regardless of location. 
                    At Rosnept, we believe that empowering individuals with smart, sustainable investment options can create 
                    a more equitable and financially independent global community.
                </p>
            </div>

            {/* Contact Info */}
            <div>
                <h4 className="text-base md:text-lg font-medium">Phone</h4>
                <p className='text-sm md:text-base font-barlow'>+1 (234) 567-8901</p>
            </div>
            <div>
                <h4 className="text-base md:text-lg font-medium">Email</h4>
                <p className='text-sm md:text-base font-barlow'>support@deltaneutral.io</p>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
