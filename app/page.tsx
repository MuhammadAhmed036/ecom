'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, Heart, Eye, ChevronLeft, ChevronRight, User, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      title: 'GET START',
      subtitle: 'YOUR FAVORITE SHOPPING',
      cta: 'BUY NOW'
    },
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
      title: 'NEW COLLECTION',
      subtitle: 'DISCOVER AHMED BRANDS',
      cta: 'SHOP NOW'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
      title: 'PREMIUM QUALITY',
      subtitle: 'ELEVATE YOUR STYLE',
      cta: 'EXPLORE'
    }
  ];

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    // Fetch featured products from API
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from API...');
        const response = await fetch('/api/products?limit=8');
        console.log('API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Products data:', data);
          setFeaturedProducts(data.products || []);
        } else {
          console.error('API Error:', response.status, response.statusText);
          const errorData = await response.text();
          console.error('Error details:', errorData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    {
      name: "Men's Clothing",
      image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500',
      href: '/mens-clothing',
      count: '150+ Items'
    },
    {
      name: "Women's Clothing",
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
      href: '/womens-clothing',
      count: '200+ Items'
    },
    {
      name: "Men's Accessories",
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
      href: '/mens-accessories',
      count: '80+ Items'
    },
    {
      name: "Women's Accessories",
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
      href: '/womens-accessories',
      count: '120+ Items'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* User Profile Display - Top Right Corner */}
      {isLoggedIn && user && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 right-8 z-20 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-white">
              <p className="text-sm font-medium">Hello, {user.name.split(' ')[0]}!</p>
              <p className="text-xs opacity-80 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              title="Logout"
            >
              <LogOut size={16} className="text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Hero Section - Similar to reference */}
      <section className="relative h-screen overflow-hidden bg-yellow-500">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </div>
        ))}
        
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto px-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl mb-8 text-white/90"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-none font-semibold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <span>{heroSlides[currentSlide].cta}</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Fashion Section - Similar to reference */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Man & Woman Fashion</h2>
            <p className="text-xl text-gray-600">Discover the latest trends at Ahmed Brands</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoadingProducts ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative h-64 bg-gray-200 animate-pulse" />
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </motion.div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-yellow-600">${product.price}</p>
                    <Link href={`/product/${product.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Explore our curated collections at Ahmed Brands</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Link href={category.href}>
                  <div className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={300}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <h3 className="text-xl font-semibold mb-2 group-hover:scale-110 transition-transform duration-300">{category.name}</h3>
                      <p className="text-sm opacity-90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{category.count}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Discover our most popular items at Ahmed Brands</p>
          </motion.div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                             {featuredProducts.map((product, index) => (
                 <ProductCard 
                   key={product.id} 
                   id={product.id}
                   name={product.name}
                   price={product.price}
                   image_url={product.image_url}
                   rating={product.rating}
                   reviews={product.reviews}
                   category={product.category}
                 />
               ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <Link href="/latest-products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-white px-8 py-4 rounded-none font-semibold text-lg hover:bg-yellow-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>View All Products</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-yellow-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '10K+', label: 'Happy Customers' },
                { number: '500+', label: 'Products' },
                { number: '50+', label: 'Brands' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
