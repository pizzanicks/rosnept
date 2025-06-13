import { FaTwitter, FaLinkedin, FaFacebookF, FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <Image src={'/logo-1.png'} height={500} width={500} alt='logo image' className="w-44 lg:w-80 h-12 lg:h-20 mb-6" />
            <p className="text-sm lg:text-base mb-4 font-barlow">
              Delta Neutral is at the intersection of cryptocurrency and sustainable energy investments, offering innovative solutions for eco-friendly portfolios and sustainable growth.
            </p>
            <div className="flex space-x-6">
              {/* <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaTwitter size={24} />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaLinkedin size={24} />
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebookF size={24} />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram size={24} />
              </Link>
               */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-4 text-sm lg:text-base font-barlow">
              <li><Link href="/about" className="hover:text-gray-400">About Us</Link></li>
              <li><Link href="/services" className="hover:text-gray-400">Services</Link></li>
              <li><Link href="/blog" className="hover:text-gray-400">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-gray-400">Contact</Link></li>
              <li><Link href="/#" className="hover:text-gray-400">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-sm lg:text-base mb-4 font-barlow">Subscribe to our newsletter for the latest updates on crypto investments, renewable energy trends, and sustainable financial strategies.</p>
            <form className="flex flex-col">
              <input
                type="email"
                placeholder="Enter your email"
                className="mb-4 p-3 text-gray-900 font-barlow"
                required
              />
              <button type="submit" className="bg-blue-600 text-white py-3 hover:bg-blue-500 transition font-barlow">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400 font-barlow">
            &copy; {new Date().getFullYear()} RosneptPro. All rights reserved. New Zealand
          </p>
        </div>
      </div>
    </footer>
  );
}
