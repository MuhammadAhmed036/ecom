'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Star,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Ahmed Brands</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your premier destination for fashion and lifestyle. Discover quality products, 
              exceptional service, and unbeatable prices at Ahmed Brands.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/j.junaidjamshed/?hl=en"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <Youtube size={20} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/latest-products" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Latest Products
                </Link>
              </li>
              <li>
                <Link href="/mens-clothing" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link href="/womens-clothing" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Women's Clothing
                </Link>
              </li>
              <li>
                <Link href="/mens-accessories" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Men's Accessories
                </Link>
              </li>
              <li>
                <Link href="/womens-accessories" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Women's Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-yellow-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400">
                  Lala Rukh Wah Cantt<br />
                  PO Box 12345
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-yellow-500 flex-shrink-0" />
                <p className="text-gray-400">+92 3129288557</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-yellow-500 flex-shrink-0" />
                <p className="text-gray-400">info@ahmedbrands.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© 2024 Ahmed Brands. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-yellow-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-yellow-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Stay Updated with Ahmed Brands</h3>
            <p className="text-gray-400 mb-6">Subscribe to our newsletter for exclusive offers and latest updates</p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500 text-white placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
