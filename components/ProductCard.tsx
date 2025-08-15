'use client';

import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating?: number;
  reviews?: number;
  category: string;
}

const ProductCard = ({ id, name, price, image_url, rating = 4.5, reviews = 128, category }: ProductCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer transition-all duration-300"
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              <Heart size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-yellow-500 hover:text-white transition-colors"
            >
              <Eye size={16} />
            </motion.button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
            {category.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-500">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-yellow-600">${price}</span>
        </div>

                 {/* Action Buttons */}
         <div className="flex space-x-2">
           <Link href={`/product/${id}`}>
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
             >
               <Eye size={16} />
               <span>View Details</span>
             </motion.button>
           </Link>
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
                           onClick={() => {
                // Check if user is logged in
                const token = localStorage.getItem('token');
                if (!token) {
                  // Show registration prompt
                  if (typeof window !== 'undefined') {
                    const shouldRegister = confirm('Please create an account to add items to your wishlist. Would you like to register now?');
                    if (shouldRegister) {
                      window.location.href = '/register';
                    }
                  }
                  return;
                }
                // Add to wishlist logic here
              }}
             className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
           >
             <Heart size={16} className="text-gray-600" />
           </motion.button>
         </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
